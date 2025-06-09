import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva, ReservaService } from '../../../../services/reserva.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-reservas',
  imports: [CommonModule],
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css']
})
export class AdminReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  error: string | null = null;

  constructor(private svc: ReservaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.listReservas().subscribe({
      next: data => {
        this.reservas = data;
        this.error = null;
      },
      error: () => this.error = 'No se pudieron cargar las reservas'
    });
  }

  setStatus(r: Reserva, estado: Reserva['estado']) {
    this.svc.changeStatus(r.id, estado).subscribe({
      next: updated => {
        const idx = this.reservas.findIndex(x => x.id === updated.id);
        if (idx >= 0) this.reservas[idx] = updated;
      },
      error: () => this.error = `No se pudo marcar como ${estado}`
    });
  }
}
