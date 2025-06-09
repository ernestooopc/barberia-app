// src/app/admin/pages/asignacion-form/asignacion-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsignacionService, Asignacion, AsignacionCreate } from '../../../../services/asignacion.service';
import { ReservaService, Reserva } from '../../../../services/reserva.service';
import { BarberoService, Barbero } from '../../../../services/barbero.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-asignacion-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './asignacion-form.component.html'
})
export class AsignacionFormComponent implements OnInit {
  form: FormGroup;
  id?: number;
  error: string | null = null;
  reservas: Reserva[] = [];
  barberos: Barbero[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: AsignacionService,
    private reservaSvc: ReservaService,
    private barberoSvc: BarberoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      reservaId: ['', Validators.required],
      barberoId: ['', Validators.required]
    });
  }

  ngOnInit() {
    forkJoin({
      r: this.reservaSvc.listReservas(),
      b: this.barberoSvc.getAll()
    }).subscribe(({ r, b }) => {
      this.reservas = r;
      this.barberos = b;
    });

    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.id = +param;
      this.svc.getById(this.id).subscribe({
        next: (a: Asignacion) => {
          this.form.patchValue({
            reservaId: a.reserva.id,
            barberoId: a.barbero.id
          });
        },
        error: () => this.error = 'No se pudo cargar la asignación'
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    Swal.fire({
        title: this.id ? '¿Seguro que quieres editar esta asignacion?'
                       : '¿Seguro que quieres crear una nueva asignacion?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.id ? 'Sí, editar' : 'Sí, crear',
        cancelButtonText: 'No, cancelar'
      }).then(result => {
        if (!result.isConfirmed) {
          return;
        }
    const { reservaId, barberoId } = this.form.value;
    const payload: AsignacionCreate = {
      reserva: { id: reservaId },
      barbero: { id: barberoId }
    };

    const obs = this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    obs.subscribe({
          next: () => {
            Swal.fire(
              '¡Listo!',
              this.id ? 'La asignacion se ha actualizado.' : 'La asignacion se ha creado.',
              'success'
            );
            this.router.navigate(['/admin/asignaciones']);
          },
          error: () => {
            // 4) Notificar fallo
            Swal.fire('Error', 'No se pudo guardar la asignacion.', 'error');
            this.error = 'Error al guardar';
          }
        });
      });
  }
}
