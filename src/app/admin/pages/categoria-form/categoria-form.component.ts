import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriaService, Categoria } from '../../../../services/categoria.service';
import { UppercaseDirective } from '../../../../shared/nav/uppercase.directive';

@Component({
  standalone: true,
  selector: 'app-categoria-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UppercaseDirective],
  templateUrl: './categoria-form.component.html'
})
export class CategoriaFormComponent implements OnInit {
  form: FormGroup;
  id?: number;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = +param;
      this.svc.getById(this.id).subscribe({
        next: (cat: Categoria) => this.form.patchValue(cat),
        error: () => this.error = 'No se pudo cargar la categoría'
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    Swal.fire({
      title: this.id ? '¿Deseas actualizar la categoría?' : '¿Deseas crear una nueva categoría?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.id ? 'Sí, actualizar' : 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      const payload = this.form.value;
      const obs = this.id
        ? this.svc.update(this.id, payload)
        : this.svc.create(payload);

      obs.subscribe({
        next: () => {
          Swal.fire(
            '¡Éxito!',
            this.id ? 'Categoría actualizada' : 'Categoría creada',
            'success'
          );
          this.router.navigate(['/admin/categoria']);
        },
        error: () => {
          Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
          this.error = 'Error al guardar';
        }
      });
    });
  }
}

