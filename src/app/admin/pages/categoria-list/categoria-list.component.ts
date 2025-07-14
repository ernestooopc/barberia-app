import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService, Categoria } from '../../../../services/categoria.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-list',
  imports: [CommonModule],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  error: string | null = null;

  constructor(private svc: CategoriaService, private router: Router) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.svc.getAll().subscribe({
      next: data => this.categorias = data,
      error: err => this.error = 'No se pudieron cargar las categorías'
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.svc.delete(id).subscribe(() => this.cargarCategorias());
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/admin/categoria/',id, 'editar']);
  }

  crear() {
    this.router.navigate(['/admin/categoria/nueva']);
  }
}
