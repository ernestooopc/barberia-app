import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'reservas',
    loadComponent: () =>
      import('./pages/reservas-list/reservas-list.component').then(m => m.ReservasListComponent)
  },
  {
    path: 'reservas/nuevo',
    loadComponent: () =>
      import('./pages/reserva-form/reserva-form.component').then(m => m.ReservaFormComponent)
  },
  {
    path: 'reservas/:id',
    loadComponent: () =>
    import('./pages/reserva-detail/reserva-detail.component')
    .then(m => m.ReservaDetailComponent)
  },

  { path: '', redirectTo: 'reservas', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule {}
