import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoCorteService, TipoCorte } from '../../../../services/tipoCorte.service';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-tipo-corte-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-corte-list.component.html'
})
export class TipoCorteListComponent implements OnInit {
  tipos: TipoCorte[] = [];
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
      next: data => this.tipos = data,
      error: () => this.error = 'No se pudieron cargar los tipos'
    });
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
