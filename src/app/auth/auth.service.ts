// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  rol:   'ADMIN' | 'USUARIO';
  id:    number;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellido:string;
  correo: string;
  contrasena: string;
  rol: 'USUARIO';
  tipoCliente: 'NUEVO';
  activo?: boolean;
  fechaRegistro?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  private _role$$ = new BehaviorSubject<string|null>(
    localStorage.getItem('role')
  );
  readonly role$ = this._role$$.asObservable();

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { correo, contrasena })
      .pipe(
        tap(res => {
          localStorage.setItem('token',  res.token);
          localStorage.setItem('role',   res.rol);
          localStorage.setItem('userId', res.id.toString());
          this._role$$.next(res.rol);
        })
      );
  }

  logout(): void {
    localStorage.clear();
    this._role$$.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return this._role$$.value;
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
}
