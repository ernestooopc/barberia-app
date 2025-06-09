// src/app/services/asignacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asignacion {
  id: number;
  reserva: { id: number; fechaHora?: string; };
  barbero: { id: number; nombre?: string; };
}

export interface AsignacionCreate {
  reserva: { id: number; };
  barbero: { id: number; };
}

@Injectable({ providedIn: 'root' })
export class AsignacionService {
  private baseUrl = 'http://localhost:8080/api/asignaciones';

  constructor(private http: HttpClient) {}

  list(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.baseUrl);
  }

  getById(id: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.baseUrl}/${id}`);
  }

  create(data: AsignacionCreate): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.baseUrl, data);
  }

  update(id: number, data: AsignacionCreate): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  exists(reservaId: number, barberoId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/exists?reservaId=${reservaId}&barberoId=${barberoId}`
    );
  }
}
