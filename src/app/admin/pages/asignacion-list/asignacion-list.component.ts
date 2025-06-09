// src/app/admin/pages/asignacion-list/asignacion-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionService, Asignacion } from '../../../../services/asignacion.service';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-asignacion-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './asignacion-list.component.html'
})
export class AsignacionListComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  error: string | null = null;

  constructor(
    private svc: AsignacionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.list().subscribe({
      next: data => this.asignaciones = data,
      error: () => this.error = 'No se pudieron cargar las asignaciones'
    });
  }

  nuevo() {
    this.router.navigate(['/admin/asignaciones/nuevo']);
  }

  editar(id: number) {
    this.router.navigate(['/admin/asignaciones', id, 'editar']);
  }

  borrar(id: number) {
    Swal.fire({
          title: '¿Seguro que quieres eliminar esta Asignacion?',
          text: '¡Esta acción no se puede deshacer!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'No, cancelar'
        }).then(result => {
          if (result.isConfirmed) {
    this.svc.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.error = 'Error al eliminar'
    });
  }
  })}}
