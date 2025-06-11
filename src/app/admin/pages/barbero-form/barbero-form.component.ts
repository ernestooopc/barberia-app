import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BarberoService, Barbero, BarberoCreate } from '../../../../services/barbero.service';
import { UppercaseDirective } from '../../../../shared/nav/uppercase.directive';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-barbero-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,UppercaseDirective],
  templateUrl: './barbero-form.component.html'
})
export class BarberoFormComponent implements OnInit {
  form: FormGroup;
  id?: number;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private svc: BarberoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
  nombre:           ['', Validators.required],
  apellido:         ['', Validators.required],
  correo:           ['', [Validators.required, Validators.email]],
  telefono:         ['', Validators.required],
  experienciaAnios: [0, [Validators.required, Validators.min(0)]],
  especialidad:     ['', Validators.required],
  activo:           [true],   // switch o checkbox
  fechaIngreso:     [        // por defecto hoy
    new Date().toISOString().substring(0,16),
    Validators.required
  ]
});
  }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = +param;
      this.svc.getById(this.id).subscribe({
        next: (b: Barbero) => this.form.patchValue(b),
        error: () => this.error = 'No se pudo cargar el barbero'
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    Swal.fire({
        title: this.id ? '¿Seguro que quieres editar la informacion del Barbero?'
                       : '¿Seguro que quieres crear un nuevo registro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.id ? 'Sí, editar' : 'Sí, crear',
        cancelButtonText: 'No, cancelar'
      }).then(result => {
        if (!result.isConfirmed) {
          return;
        }
    const payload: BarberoCreate = this.form.value;

    const obs = this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    obs.subscribe({
          next: () => {
            Swal.fire(
              '¡Listo!',
              this.id ? 'Los Datos se han actualizado.' : 'Los datos se ha creado.',
              'success'
            );
            this.router.navigate(['/admin/barberos']);
          },
          error: () => {
            // 4) Notificar fallo
            Swal.fire('Error', 'No se pudo guardar los datos.', 'error');
            this.error = 'Error al guardar';
          }
        });
  })
  }
}
