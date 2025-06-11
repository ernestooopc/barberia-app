import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../auth/AdminGuard';  // ajusta la ruta
import { HorariosRangoComponent } from './pages/horarios-rango/horarios-rango.component';

const routes: Routes = [
  {
    path: 'tipo-cortes',
    loadComponent: () =>
      import('./pages/tipo-corte-list/tipo-corte-list.component')
        .then(m => m.TipoCorteListComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'tipo-cortes/nuevo',
    loadComponent: () =>
      import('./pages/tipo-corte-form/tipo-corte-form.component')
        .then(m => m.TipoCorteFormComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'tipo-cortes/:id/editar',
    loadComponent: () =>
      import('./pages/tipo-corte-form/tipo-corte-form.component')
        .then(m => m.TipoCorteFormComponent),
          canActivate: [AdminGuard]
  },
   {
    path: 'barberos',
    loadComponent: () =>
      import('./pages/barbero-list/barbero-list.component').then(m => m.BarberoListComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'barberos/nuevo',
    loadComponent: () =>
      import('./pages/barbero-form/barbero-form.component').then(m => m.BarberoFormComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'barberos/:id/editar',
    loadComponent: () =>
      import('./pages/barbero-form/barbero-form.component').then(m => m.BarberoFormComponent),
          canActivate: [AdminGuard]
  },
   {
    path: 'asignaciones',
    loadComponent: () =>
      import('./pages/asignacion-list/asignacion-list.component')
        .then(m => m.AsignacionListComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'asignaciones/nuevo',
    loadComponent: () =>
      import('./pages/asignacion-form/asignacion-form.component')
        .then(m => m.AsignacionFormComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'asignaciones/:id/editar',
    loadComponent: () =>
      import('./pages/asignacion-form/asignacion-form.component')
        .then(m => m.AsignacionFormComponent),
          canActivate: [AdminGuard]
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./pages/admin-reservas/admin-reservas.component')
        .then(m => m.AdminReservasComponent),
          canActivate: [AdminGuard]
  },

  {
  path: 'horarios-rango',
  loadComponent: () =>
      import('./pages/horarios-rango/horarios-rango.component')
        .then(m => m.HorariosRangoComponent),
          canActivate: [AdminGuard]
  },

  { path: '', redirectTo: 'reservas', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
