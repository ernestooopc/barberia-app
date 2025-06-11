import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface HorarioRangoRequest {
  barberoId: number;
  fecha: string;
  inicio: string;
  fin: string;
  intervaloMinutos: number;
}
@Injectable({
  providedIn: 'root',
})
export class HorarioDisponibleService {
  private apiUrl = 'http://localhost:8080/api/horarios-disponibles';

  constructor(private http: HttpClient) {}

  obtenerPorBarberoYFecha(barberoId: number, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/barbero/${barberoId}?fecha=${fecha}`
    );
  }

  obtenerHorariosDisponibles(
    barberoId: number,
    fecha: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/api/horarios-disponibles/barbero/${barberoId}?fecha=${fecha}`
    );
  }

  generarHorariosRango(data: HorarioRangoRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/rango`, data, {
      responseType: 'text' as 'json'
    });
  }
}
