import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from './api-base';
import { Annonce, Categorie, Message, Page, Reservation, ReservationStatut } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Categories
  categories(): Observable<Categorie[]> { return this.http.get<Categorie[]>(`${API_BASE}/categories`); }

  // Annonces
  searchAnnonces(q: any = {}): Observable<Page<Annonce>> {
    let p = new HttpParams();
    Object.keys(q).forEach(k => { if (q[k] !== undefined && q[k] !== null && q[k] !== '') p = p.set(k, q[k]); });
    return this.http.get<Page<Annonce>>(`${API_BASE}/annonces`, { params: p });
  }
  getAnnonce(id: number): Observable<Annonce> { return this.http.get<Annonce>(`${API_BASE}/annonces/${id}`); }
  mesAnnonces(): Observable<Annonce[]> { return this.http.get<Annonce[]>(`${API_BASE}/annonces/mine`); }
  createAnnonce(a: any): Observable<Annonce> { return this.http.post<Annonce>(`${API_BASE}/annonces`, a); }
  updateAnnonce(id: number, a: any): Observable<Annonce> { return this.http.put<Annonce>(`${API_BASE}/annonces/${id}`, a); }
  deleteAnnonce(id: number): Observable<void> { return this.http.delete<void>(`${API_BASE}/annonces/${id}`); }

  // Reservations
  reserver(r: any): Observable<Reservation> { return this.http.post<Reservation>(`${API_BASE}/reservations`, r); }
  mesReservations(): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${API_BASE}/reservations/mine`); }
  reservationsRecues(): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${API_BASE}/reservations/received`); }
  changerStatut(id: number, value: ReservationStatut): Observable<Reservation> {
    return this.http.patch<Reservation>(`${API_BASE}/reservations/${id}/statut`, null, { params: { value } });
  }

  // Messages
  envoyerMessage(m: any): Observable<Message> { return this.http.post<Message>(`${API_BASE}/messages`, m); }
  mesMessages(): Observable<Message[]> { return this.http.get<Message[]>(`${API_BASE}/messages`); }
  thread(otherUserId: number): Observable<Message[]> { return this.http.get<Message[]>(`${API_BASE}/messages/thread/${otherUserId}`); }

  // Paiement
  payer(reservationId: number, methode = 'carte'): Observable<any> {
    return this.http.post(`${API_BASE}/paiements/simuler/${reservationId}`, null, { params: { methode } });
  }
}
