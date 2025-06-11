import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HorarioDisponibleService } from '../../../../services/horarioDisponible.service';
import { BarberoService, Barbero } from '../../../../services/barbero.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-horarios-rango',
  standalone: true,
  templateUrl: './horarios-rango.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [HorarioDisponibleService]
})
export class HorariosRangoComponent implements OnInit {
  form: FormGroup;
  barberos: Barbero[] = [];
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioDisponibleService,
    private barberoService: BarberoService
  ) {
    this.form = this.fb.group({
      barberoId: [null, Validators.required],
      fecha: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      intervaloMinutos: [30, [Validators.required, Validators.min(5)]],
    });
  }

  ngOnInit(): void {
    this.barberoService.getAll().subscribe({
      next: (barberos) => this.barberos = barberos,
      error: () => this.error = 'No se pudieron cargar los barberos'
    });
  }

  generar(): void {
    if (this.form.invalid) return;

    this.horarioService.generarHorariosRango(this.form.value).subscribe({
      next: (resp) => Swal.fire('Éxito', resp, 'success'),
      error: () => Swal.fire('Error', 'No se pudo generar los horarios', 'error')
    });
  }
}
