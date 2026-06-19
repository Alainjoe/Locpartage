import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from './models';
import { API_BASE } from './api-base';

const TOKEN_KEY = 'lp_token';
const USER_KEY = 'lp_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.loadUser());
  user = this._user.asReadonly();
  isLogged = computed(() => this._user() !== null);
  isAdmin = computed(() => this._user()?.role === 'ADMIN');

  constructor(private http: HttpClient) {}

  private loadUser(): User | null {
    const s = localStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  }

  token(): string | null { return localStorage.getItem(TOKEN_KEY); }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, { email, password })
      .pipe(tap(r => this.persist(r)));
  }

  register(payload: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/register`, payload)
      .pipe(tap(r => this.persist(r)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  private persist(r: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, r.token);
    localStorage.setItem(USER_KEY, JSON.stringify(r.user));
    this._user.set(r.user);
  }
}
