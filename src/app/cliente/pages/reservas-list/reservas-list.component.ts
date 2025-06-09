import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ReservaService, Reserva } from '../../../../services/reserva.service';
import { RouterModule } from '@angular/router';
import { UppercaseDirective } from '../../../../shared/nav/uppercase.directive';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-reservas-list',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './reservas-list.component.html'
})
export class ReservasListComponent implements OnInit {
  form: FormGroup;
  allReservas: Reserva[] = [];
  displayedReservas: Reserva[] = [];
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
  ) {
    this.form = this.fb.group({
      desde: ['', Validators.required],
      hasta: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.reservaService.listReservas().subscribe({
      next: data => {
        this.allReservas = data;
        this.displayedReservas = [...data];
      },
      error: () => this.error = 'No se pudieron cargar las reservas'
    });
  }

  search() {
    if (this.form.invalid) return;
    const { desde, hasta } = this.form.value;
    const d = new Date(desde), h = new Date(hasta);
    this.displayedReservas = this.allReservas.filter(r => {
      const f = new Date(r.fechaHora);
      return f >= d && f <= h;
    });
  }


  load() {
  this.reservaService.listReservas().subscribe({
    next: data => {
      this.allReservas = data;
      this.displayedReservas = [...data];  // ← aquí
      this.error = null;
    },
    error: () => this.error = 'No se pudieron cargar las reservas'
  });
}


cancelar(id: number) {
  Swal.fire({
        title: '¿Seguro que quieres cancelar la reserva?',
        text: '¡Esta acción no se puede deshacer!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, cancelar'
      }).then(result => {
        if (result.isConfirmed) {

  this.reservaService.changeStatus(id, 'CANCELADA').subscribe({
    next: updated => {
      const idx = this.allReservas.findIndex(r => r.id === id);
      this.allReservas[idx] = updated;
      this.load();
    },
    error: () => this.error = 'No se pudo cancelar'
  });
}})}



  setStatus(r: Reserva, estado: Reserva['estado']) {
    this.reservaService.changeStatus(r.id, estado).subscribe({
      next: updated => {
        const idx = this.allReservas.findIndex(x => x.id === updated.id);
        if (idx >= 0) this.allReservas[idx] = updated;
      },
      error: () => this.error = `No se pudo marcar como ${estado}`
    });
  }

}
