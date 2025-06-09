// src/app/services/tipo-corte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface TipoCorte {
  id: number;
  nombre: string;
  descripcion:string;
  precio: number;
  duracion: number;
}


@Injectable({ providedIn: 'root' })
export class TipoCorteService {
  private baseUrl = 'http://localhost:8080/api/tipocortes';

  constructor(private http: HttpClient) {}


  getAll(): Observable<TipoCorte[]> {
    return this.http.get<TipoCorte[]>(this.baseUrl);
  }

  create(data: Omit<TipoCorte, 'id'>): Observable<TipoCorte> {
    this._reload$.next();

    return this.http.post<TipoCorte>(this.baseUrl, data);
  }

  update(id: number, data: Omit<TipoCorte, 'id'>): Observable<TipoCorte> {
    this._reload$.next();
    return this.http.put<TipoCorte>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    this._reload$.next();
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private _reload$ = new Subject<void>();
  reload$ = this._reload$.asObservable();

}
