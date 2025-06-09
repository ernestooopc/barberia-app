import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Barbero {
  id: number;
  nombre: string;
  dni: string;
  experienciaLaboral: string;
}

export interface BarberoCreate {
  nombre: string;
  dni: string;
  experienciaLaboral: string;
}

@Injectable({ providedIn: 'root' })
export class BarberoService {
  private baseUrl = 'http://localhost:8080/api/barberos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Barbero[]> {
    return this.http.get<Barbero[]>(this.baseUrl);
  }

  getById(id: number): Observable<Barbero> {
    return this.http.get<Barbero>(`${this.baseUrl}/${id}`);
  }

  create(data: BarberoCreate): Observable<Barbero> {
    return this.http.post<Barbero>(this.baseUrl, data);
  }

  update(id: number, data: BarberoCreate): Observable<Barbero> {
  return this.http.put<Barbero>(`${this.baseUrl}/${id}`, data);
}
delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}
