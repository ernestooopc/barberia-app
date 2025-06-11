// src/app/admin/pages/admin-reservas/admin-reservas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Reserva, ReservaService } from '../../../../services/reserva.service';

@Component({
  standalone: true,
  selector: 'app-admin-reservas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css']
})
export class AdminReservasComponent implements OnInit {
  reservas: Reserva[]     = [];
  filtered: Reserva[]     = [];
  error: string | null    = null;

  // FormGroup para los filtros
  filterForm: FormGroup;

  constructor(
    private svc: ReservaService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchName:    [''],
      filterStatus: ['ALL']
    });
  }

  ngOnInit() {
    this.load();

    // 2) Nos suscribimos a cualquier cambio en el form
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
  }

   resetFilters() {
    this.filterForm.setValue({
      searchName:  '',
      filterStatus:'ALL'
    });
    this.load();
    this.applyFilters();
  }

  load() {
    this.svc.listReservas().subscribe({
      next: data => {
        this.reservas  = data;
        this.applyFilters();
        this.error      = null;
      },
      error: () => this.error = 'No se pudieron cargar las reservas'
    });
  }

  /** 3) Filtra según el form */
  applyFilters() {
    const { searchName, filterStatus } = this.filterForm.value;
    const name = (searchName as string).toLowerCase().trim();

    this.filtered = this.reservas.filter(r => {
      const matchName   = !name || r.usuario.nombre.toLowerCase().includes(name);
      const matchStatus = filterStatus === 'ALL' || r.estado === filterStatus;
      return matchName && matchStatus;
    });
  }

  setStatus(r: Reserva, estado: Reserva['estado']) {
    this.svc.changeStatus(r.id, estado).subscribe({
      next: updated => {
        const i = this.reservas.findIndex(x => x.id === updated.id);
        this.reservas[i] = updated;
        this.applyFilters();  // refrescamos tras cambiar estado
      },
      error: () => this.error = `No se pudo marcar como ${estado}`
    });
  }
}
