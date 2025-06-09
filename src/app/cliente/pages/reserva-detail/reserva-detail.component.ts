import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ReservaService, Reserva } from '../../../../services/reserva.service';

@Component({
  standalone: true,
  selector: 'app-reserva-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './reserva-detail.component.html',
})
export class ReservaDetailComponent implements OnInit {
  reserva?: Reserva;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private svc: ReservaService,
    private location: Location
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next: (r) => this.reserva = r,
      error: () => this.error = 'No se pudo cargar la reserva'
    });
  }

  goBack() {
    this.location.back();
  }
}
