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

  constructor(
    private fb: FormBuilder,
    private svc: TipoCorteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = +param;
      this.svc.getAll().subscribe({ // o un getById si lo tienes
        next: data => {
          const t = data.find(x => x.id === this.id)!;
          this.form.patchValue(t);
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
    const payload = this.form.value as Omit<TipoCorte, 'id'>;
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
