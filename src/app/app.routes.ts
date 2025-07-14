import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/auth.guard';
import { NotFoundComponent } from '../shared/not-found.component';
import { LandingPageComponent } from '../shared/landing-page.component';

export const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'',component: LandingPageComponent},
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
  },
  {
    path: 'cliente',
    loadChildren: () =>
      import('./cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent  },
];
