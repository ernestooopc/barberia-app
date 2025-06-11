import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  id: number;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  tipoCorte: {
    id: number;
    nombre?: string;
    precio?:number;
    duracion?:string;
  };
  barbero:{
    id:number;
    nombre?:string;
  };
  fechaHora: string;
  estado: 'PENDIENTE' | 'CANCELADA' | 'COMPLETADA';
}

export interface ReservaCreate {
  usuario: { id: number };
  tipoCorte: { id: number };
  barbero:{id:number};
  fechaHora: string;
}


@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private baseUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) {}

  // Listar todas las reservas
  listReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}`);
  }

  // Obtener una reserva por ID
  getById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}/${id}`);
  }

  // Buscar reservas de un usuario
  findByUsuarioId(usuarioId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  // Filtrar por estado
  findByEstado(estado: Reserva['estado']): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/estado/${estado}`);
  }

  // Filtrar por rango de fechas
  getBetweenDates(desde: string, hasta: string): Observable<Reserva[]> {
    const params = `?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`;
    return this.http.get<Reserva[]>(`${this.baseUrl}/entre-fechas${params}`);
  }

  // Verificar existencia en una fecha concreta
  existsByFechaHora(fechaHora: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/existe-en-fecha?fechaHora=${encodeURIComponent(fechaHora)}`
    );
  }

  // Crear nueva reserva
  createReserva(reserva: ReservaCreate): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.baseUrl}`, reserva);
  }

  updateReserva(id: number, body: Partial<Reserva>): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.baseUrl}/${id}`, body);
  }

   /** Llama al PATCH /api/reservas/{id}/estado?nuevoEstado=... */
  changeStatus(
    id: number,
    estado: 'PENDIENTE' | 'CANCELADA' | 'COMPLETADA'
  ): Observable<Reserva> {
    return this.http.patch<Reserva>(
      `${this.baseUrl}/${id}/estado`,
      null,
      { params: { nuevoEstado: estado } }
    );
  }


  cancelarReserva(id: number): Observable<string> {
  return this.http.patch<string>(
    `${this.baseUrl}/${id}/cancelar`,
    {},
    { responseType: 'text' as 'json' }
  );
}



}
