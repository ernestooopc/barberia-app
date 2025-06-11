import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberoService, Barbero } from '../../../../services/barbero.service';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-barbero-list',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './barbero-list.component.html'
})
export class BarberoListComponent implements OnInit {
  barberos: Barbero[] = [];
  error: string | null = null;
  filteredBarberos: Barbero[] = [];
  searchTerm: string = '';
  constructor(
    private svc: BarberoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();

  }

  applyFilterBarbero() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredBarberos = term
      ? this.barberos.filter(b => b.nombre.toLowerCase().includes(term))
      : [...this.barberos];
  }


  load() {
    this.svc.getAll().subscribe({
      next: data => {
        this.barberos = data;
        this.filteredBarberos = data;
        this.error = null;
      },
      error: () => this.error = 'No se pudieron cargar los barberos'
    });
  }

  borrar(id: number) {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este barbero?',
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
  }})}

  editar(id: number) {
    this.router.navigate(['/admin/barberos', id, 'editar']);
  }

  nuevo() {
    this.router.navigate(['/admin/barberos/nuevo']);
  }
}
