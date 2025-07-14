import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoCorteService, TipoCorte } from '../../../../services/tipoCorte.service';
import { UppercaseDirective } from '../../../../shared/nav/uppercase.directive';
import Swal from 'sweetalert2';
import { Categoria, CategoriaService } from '../../../../services/categoria.service';

@Component({
  standalone: true,
  selector: 'app-tipo-corte-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,UppercaseDirective],
  templateUrl: './tipo-corte-form.component.html'
})
export class TipoCorteFormComponent implements OnInit {
  form: FormGroup;
  id?: number;
  error: string | null = null;
  categorias: Categoria[] = [];
  constructor(
    private fb: FormBuilder,
    private svc: TipoCorteService,
    private route: ActivatedRoute,
    private router: Router,
    private svcCategoria: CategoriaService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required]
    });
  }

  ngOnInit() {
  // cargar categorías SIEMPRE
  this.svcCategoria.getAll().subscribe({
    next: (data) => this.categorias = data,
    error: () => this.error = 'No se pudieron cargar las categorías'
  });

  // solo si estás editando
  const param = this.route.snapshot.paramMap.get('id');
  if (param) {
    this.id = +param;
    this.svc.getAll().subscribe({
      next: data => {
        const t = data.find(x => x.id === this.id)!;
        this.form.patchValue({
  ...t,
  categoriaId: (t as any).categoria?.id ?? t.categoriaId
});
      },
      error: () => this.error = 'No se pudo cargar el tipo'
    });
  }
}


  onSubmit() {
  if (this.form.invalid) return;
  Swal.fire({
    title: this.id ? '¿Seguro que quieres editar este corte?'
                   : '¿Seguro que quieres crear un nuevo corte?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: this.id ? 'Sí, editar' : 'Sí, crear',
    cancelButtonText: 'No, cancelar'
  }).then(result => {
    if (!result.isConfirmed) {
      return;
    }
    const raw = this.form.value;

const payload = {
  ...raw,
  categoria: { id: raw.categoriaId } // 👈 esto es lo que el backend espera
};
delete (payload as any).categoriaId;
    const obs = this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    obs.subscribe({
      next: () => {
        Swal.fire(
          '¡Listo!',
          this.id ? 'El corte se ha actualizado.' : 'El corte se ha creado.',
          'success'
        );
        this.router.navigate(['/admin/tipo-cortes']);
      },
      error: () => {
        // 4) Notificar fallo
        Swal.fire('Error', 'No se pudo guardar el corte.', 'error');
        this.error = 'Error al guardar';
      }
    });
  });
}
}
