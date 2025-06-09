import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservaService, ReservaCreate } from '../../../../services/reserva.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoCorte, TipoCorteService } from '../../../../services/tipoCorte.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-reserva-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserva-form.component.html'
})
export class ReservaFormComponent implements OnInit {
  form!: FormGroup;
  tipos: TipoCorte[] = [];
  selectedTipo?: TipoCorte;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private tipoService: TipoCorteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      fechaHora:   ['', Validators.required],
      tipoCorteId: ['', Validators.required]
    });

    this.tipoService.getAll().subscribe(data => this.tipos = data);

    this.form.get('tipoCorteId')!.valueChanges.subscribe(id => {
      const num = Number(id);
      this.selectedTipo = this.tipos.find(t => t.id === num);
    });


  }

  onSubmit() {
  if (this.form.invalid) {
    this.error = 'Completa todos los campos';
    return;
  }
  this.error = null;

  const fechaHora = this.form.get('fechaHora')!.value as string;
  const tipoCorteId = Number(this.form.get('tipoCorteId')!.value);
  const userId = Number(localStorage.getItem('userId'));

  if (!userId) {
    this.error = 'No estás autenticado';
    return;
  }

  const nuevaReserva: ReservaCreate = {
    usuario:   { id: userId },
    tipoCorte: { id: tipoCorteId },
    fechaHora
  };

  // 1) Pido confirmación
  Swal.fire({
    title: '¿Confirmar reserva?',
    html: `
      <p><strong>Servicio:</strong> ${this.selectedTipo?.nombre}</p>
      <p><strong>Fecha/Hora:</strong> ${new Date(fechaHora).toLocaleString()}</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, reservar',
    cancelButtonText: 'No, cancelar'
  }).then(result => {
    if (!result.isConfirmed) {
      return; // el usuario canceló
    }

    // 2) Si confirma, creo la reserva
    this.reservaService.createReserva(nuevaReserva).subscribe({
      next: () => {
        // 3a) Mensaje de éxito
        Swal.fire(
          '¡Reserva creada!',
          'Tu reserva ha sido confirmada con éxito.',
          'success'
        ).then(() => {
          this.router.navigate(['/cliente/reservas']);
        });
      },
      error: () => {
        // 3b) Mensaje de error
        Swal.fire('Error', 'No se pudo crear la reserva.', 'error');
        this.error = 'Error al crear la reserva';
      }
    });
  });
}
}
