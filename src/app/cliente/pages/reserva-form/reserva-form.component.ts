import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservaService, ReservaCreate } from '../../../../services/reserva.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoCorte, TipoCorteService } from '../../../../services/tipoCorte.service';
import Swal from 'sweetalert2';
import { Barbero, BarberoService } from '../../../../services/barbero.service';
import { HorarioDisponibleService } from '../../../../services/horarioDisponible.service';

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

  barberos: Barbero[] = [];
  horariosDisponibles: string[] = [];

  error: string | null = null;
  fechaSeleccionada: string = '';
  barberoIdSeleccionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private tipoService: TipoCorteService,
    private barberoService: BarberoService,
    private horarioService: HorarioDisponibleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      barberoId: ['', Validators.required],
      fecha:     ['', Validators.required],
      hora:      ['', Validators.required],
      tipoCorteId: ['', Validators.required]
    });

    this.tipoService.getAll().subscribe(data => this.tipos = data);
    this.barberoService.getAll().subscribe(data => this.barberos = data);

    this.form.get('tipoCorteId')!.valueChanges.subscribe(id => {
      const num = Number(id);
      this.selectedTipo = this.tipos.find(t => t.id === num);
    });

    this.route.queryParams.subscribe(params => {
  const barberoId = params['barberoId'];
  const fecha = params['fecha'];
  const hora = params['hora'];
  const tipoCorteId = params['tipoCorteId'];

  if (barberoId) {
    this.form.patchValue({ barberoId: barberoId });
    this.barberoIdSeleccionado = +barberoId;
  }

  if (fecha) {
    this.form.patchValue({ fecha: fecha });
    this.fechaSeleccionada = fecha;
  }

  if (hora) {
    this.form.patchValue({ hora: hora });
  }

  if (tipoCorteId) {
    this.form.patchValue({ tipoCorteId: tipoCorteId });
  }

  if (barberoId && fecha) {
    this.intentarCargarHorarios();
  }
});



  }

  onBarberoChange(event: Event) {
  const select = event.target as HTMLSelectElement | null;
  const value = select?.value;

  if (value) {
    this.barberoIdSeleccionado = Number(value);
    this.intentarCargarHorarios();
  }
}

  onFechaChange(event: Event) {
  const input = event.target as HTMLInputElement | null;

  if (input?.value) {
    this.fechaSeleccionada = input.value;
    this.intentarCargarHorarios();
  }
}



  intentarCargarHorarios() {
    if (this.barberoIdSeleccionado && this.fechaSeleccionada) {
      this.horarioService
        .obtenerHorariosDisponibles(this.barberoIdSeleccionado, this.fechaSeleccionada)
        .subscribe(data => {
          this.horariosDisponibles = data.map(h => h.hora); // formato 'HH:mm:ss'
        });
    }
        console.log('Consultando horarios con:', this.barberoIdSeleccionado, this.fechaSeleccionada);

  }

  onSubmit() {
    if (this.form.invalid) {
      this.error = 'Completa todos los campos';
      return;
    }
    this.error = null;

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.error = 'No estás autenticado';
      return;
    }

    const fecha = this.form.get('fecha')!.value;
    const hora = this.form.get('hora')!.value;
    const fechaHora = `${fecha}T${hora}`;

    const nuevaReserva: ReservaCreate = {
      usuario: { id: userId },
      barbero: { id: Number(this.form.get('barberoId')!.value) },
      tipoCorte: { id: Number(this.form.get('tipoCorteId')!.value) },
      fechaHora
    };

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
      if (!result.isConfirmed) return;

      this.reservaService.createReserva(nuevaReserva).subscribe({
        next: () => {
          Swal.fire('¡Reserva creada!', 'Tu reserva ha sido confirmada con éxito.', 'success')
            .then(() => this.router.navigate(['/cliente/reservas']));
        },
        error: () => {
          Swal.fire('Error', 'No se pudo crear la reserva.', 'error');
          this.error = 'Error al crear la reserva';
          console.error('Error al crear la reserva:', this.error);

        }
      });
    });
  }
}
