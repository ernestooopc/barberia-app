import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../app/auth/auth.service';


@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
