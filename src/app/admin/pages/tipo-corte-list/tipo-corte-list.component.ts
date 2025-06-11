import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoCorteService, TipoCorte } from '../../../../services/tipoCorte.service';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-tipo-corte-list',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './tipo-corte-list.component.html'
})
export class TipoCorteListComponent implements OnInit {
  tipos: TipoCorte[] = [];
  filteredTipos: TipoCorte[] = [];
  searchTerm: string = '';
  error: string | null = null;

  constructor(
    private svc: TipoCorteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
     this.svc.reload$.subscribe(() => this.load());
  }


  load() {
    this.svc.getAll().subscribe({
      next: data => {
        this.tipos = data;
        this.filteredTipos = data;
        this.error = null;
      },
      error: () => this.error = 'No se pudieron cargar los tipos'
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredTipos = term
      ? this.tipos.filter(t => t.nombre.toLowerCase().includes(term))
      : [...this.tipos];
  }


  borrar(id: number) {
    Swal.fire({
              title: '¿Seguro que quieres eliminar este Tipo de Corte?',
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
    this.router.navigate(['/admin/tipo-cortes', id, 'editar']);
  }

  nuevo() {
    this.router.navigate(['/admin/tipo-cortes/nuevo']);
  }
}
