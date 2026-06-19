import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Annonce, Reservation, ReservationStatut } from '../../core/models';

type DashboardTab = 'overview' | 'annonces' | 'reservations' | 'recues';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-page">
      <aside class="dash-sidebar">
        <div class="sidebar-title">Menu principal</div>
        <button type="button" [class.active]="tab() === 'overview'" (click)="tab.set('overview')">
          <span class="material-symbols-outlined">dashboard</span> Vue d'ensemble
        </button>
        <button type="button" [class.active]="tab() === 'annonces'" (click)="tab.set('annonces')">
          <span class="material-symbols-outlined">inventory_2</span> Mes annonces
        </button>
        <button type="button" [class.active]="tab() === 'reservations'" (click)="tab.set('reservations')">
          <span class="material-symbols-outlined">event</span> Mes réservations
        </button>
        <button type="button" [class.active]="tab() === 'recues'" (click)="tab.set('recues')">
          <span class="material-symbols-outlined">move_to_inbox</span> Réservations reçues
        </button>
        <a routerLink="/messages">
          <span class="material-symbols-outlined">chat_bubble</span> Messages
        </a>
        <a routerLink="/annonces">
          <span class="material-symbols-outlined">favorite</span> Favoris
        </a>
      </aside>

      <main class="dash-main">
        <header class="dash-head">
          <div>
            <h1>Bonjour, {{ auth.user()?.prenom || 'membre' }}</h1>
            <p>Voici ce qui se passe avec vos locations aujourd'hui.</p>
          </div>
          <a routerLink="/annonces/nouvelle" class="btn btn-primary">
            <span class="material-symbols-outlined">add_circle</span>
            Publier
          </a>
        </header>

        @if (notice()) {
          <div class="alert alert-success">{{ notice() }}</div>
        }

        @if (tab() === 'overview') {
          <div class="stats-grid">
            <article class="stat-card">
              <span class="material-symbols-outlined">payments</span>
              <small>Gains totaux</small>
              <strong>{{ totalGains() | number:'1.2-2' }} $</strong>
            </article>
            <article class="stat-card lime">
              <span class="material-symbols-outlined">sync_alt</span>
              <small>Locations en cours</small>
              <strong>{{ activeReservations() }}</strong>
            </article>
            <article class="promo-card">
              <h2>Boostez vos revenus</h2>
              <p>Améliorez vos photos pour augmenter vos réservations de 30%.</p>
              <a routerLink="/annonces/nouvelle" class="btn btn-secondary">Optimiser mes annonces</a>
            </article>
          </div>

          <div class="overview-grid">
            <section>
              <div class="section-row">
                <h2>Réservations à venir</h2>
                <button type="button" (click)="tab.set('reservations')">Voir tout</button>
              </div>
              <div class="reservation-list">
                @for (r of mesReservations().slice(0, 3); track r.id) {
                  <article class="reservation-item">
                    <div class="item-thumb"><span class="material-symbols-outlined">event_available</span></div>
                    <div>
                      <span class="badge" [class.badge-success]="r.statut === 'CONFIRMEE'"
                                          [class.badge-warn]="r.statut === 'EN_ATTENTE'"
                                          [class.badge-danger]="r.statut === 'ANNULEE'"
                                          [class.badge-muted]="r.statut === 'TERMINEE'">{{ statusLabel(r.statut) }}</span>
                      <h3>{{ r.annonceTitre }}</h3>
                      <p>Par {{ r.locataireNom || 'un membre' }}</p>
                    </div>
                    <div class="reservation-price">
                      <span>{{ r.dateDebut }} - {{ r.dateFin }}</span>
                      <strong>{{ r.montantTotal | number:'1.2-2' }} $</strong>
                    </div>
                  </article>
                } @empty {
                  <div class="empty-card">Aucune réservation en cours.</div>
                }
              </div>
            </section>

            <aside class="side-panels">
              <article class="messages-card">
                <h2>Messagerie</h2>
                <p>Consultez vos discussions avec les propriétaires et locataires.</p>
                <a routerLink="/messages">Ouvrir la messagerie</a>
              </article>
            </aside>
          </div>
        }

        @if (tab() === 'annonces') {
          <div class="section-row">
            <h2>Mes annonces ({{ annonces().length }})</h2>
            <a routerLink="/annonces/nouvelle" class="btn btn-primary btn-sm">Publier</a>
          </div>
          <div class="owner-grid">
            @for (a of annonces(); track a.id) {
              <article class="owner-listing">
                @if (a.photos.length) {
                  <img [src]="a.photos[0]" [alt]="a.titre">
                } @else {
                  <div class="item-thumb"><span class="material-symbols-outlined">photo_camera</span></div>
                }
                <div>
                  <h3>{{ a.titre }}</h3>
                  <p>{{ a.ville || 'Québec' }} • {{ a.prixJour | number:'1.2-2' }} $/jour</p>
                </div>
                <div class="owner-actions">
                  <a [routerLink]="['/annonces', a.id]" class="btn btn-outline btn-sm">Voir</a>
                  <button class="btn btn-danger btn-sm" type="button" (click)="supprimer(a.id)">Supprimer</button>
                </div>
              </article>
            } @empty {
              <div class="empty-card">Aucune annonce publiée.</div>
            }
          </div>
        }

        @if (tab() === 'reservations') {
          <h2>Mes réservations ({{ mesReservations().length }})</h2>
          <div class="reservation-list">
            @for (r of mesReservations(); track r.id) {
              <article class="reservation-item wide">
                <div class="item-thumb"><span class="material-symbols-outlined">calendar_month</span></div>
                <div>
                  <span class="badge" [class.badge-success]="r.statut === 'CONFIRMEE'"
                                      [class.badge-warn]="r.statut === 'EN_ATTENTE'"
                                      [class.badge-danger]="r.statut === 'ANNULEE'"
                                      [class.badge-muted]="r.statut === 'TERMINEE'">{{ statusLabel(r.statut) }}</span>
                  <h3>{{ r.annonceTitre }}</h3>
                  <p>{{ r.dateDebut }} → {{ r.dateFin }}</p>
                </div>
                <div class="reservation-actions">
                  <strong>{{ r.montantTotal | number:'1.2-2' }} $</strong>
                  @if (r.statut === 'EN_ATTENTE') {
                    <button class="btn btn-ghost btn-sm" type="button" (click)="changerStatut(r.id, 'ANNULEE')">Annuler</button>
                  }
                  @if (r.statut === 'CONFIRMEE') {
                    <button class="btn btn-secondary btn-sm" type="button" (click)="payer(r.id)">Payer</button>
                  }
                </div>
              </article>
            } @empty {
              <div class="empty-card">Aucune réservation en cours.</div>
            }
          </div>
        }

        @if (tab() === 'recues') {
          <h2>Réservations reçues ({{ recues().length }})</h2>
          <div class="reservation-list">
            @for (r of recues(); track r.id) {
              <article class="reservation-item wide">
                <div class="item-thumb"><span class="material-symbols-outlined">inbox</span></div>
                <div>
                  <span class="badge" [class.badge-success]="r.statut === 'CONFIRMEE'"
                                      [class.badge-warn]="r.statut === 'EN_ATTENTE'"
                                      [class.badge-danger]="r.statut === 'ANNULEE'"
                                      [class.badge-muted]="r.statut === 'TERMINEE'">{{ statusLabel(r.statut) }}</span>
                  <h3>{{ r.annonceTitre }}</h3>
                  <p>Par {{ r.locataireNom }} • {{ r.dateDebut }} → {{ r.dateFin }}</p>
                </div>
                <div class="reservation-actions">
                  <strong>{{ r.montantTotal | number:'1.2-2' }} $</strong>
                  @if (r.statut === 'EN_ATTENTE') {
                    <button class="btn btn-secondary btn-sm" type="button" (click)="changerStatut(r.id, 'CONFIRMEE')">Confirmer</button>
                    <button class="btn btn-ghost btn-sm" type="button" (click)="changerStatut(r.id, 'ANNULEE')">Refuser</button>
                  }
                  @if (r.statut === 'CONFIRMEE') {
                    <button class="btn btn-outline btn-sm" type="button" (click)="changerStatut(r.id, 'TERMINEE')">Terminer</button>
                  }
                </div>
              </article>
            } @empty {
              <div class="empty-card">Aucune réservation reçue.</div>
            }
          </div>
        }
      </main>
    </section>
  `,
  styles: [`
    .dashboard-page {
      display: grid;
      max-width: 1500px;
      margin: 0 auto;
      min-height: 760px;
    }

    .dash-sidebar {
      display: none;
      padding: var(--space-6);
      border-right: 1px solid var(--c-border-subtle);
      background: #fff;
    }

    .sidebar-title {
      margin-bottom: var(--space-4);
      color: var(--c-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 800;
    }

    .dash-sidebar button,
    .dash-sidebar a {
      width: 100%;
      min-height: 58px;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: 0 var(--space-4);
      border: 0;
      border-radius: var(--radius-xl);
      background: transparent;
      color: var(--c-text-main);
      font: inherit;
      font-weight: 800;
      text-align: left;
      cursor: pointer;
      text-decoration: none;
      margin-bottom: var(--space-2);
    }

    .dash-sidebar button.active,
    .dash-sidebar button:hover,
    .dash-sidebar a:hover {
      background: var(--c-primary-fixed);
      color: var(--c-primary);
      text-decoration: none;
    }

    .dash-main {
      padding: var(--space-6) var(--margin-mobile) var(--space-10);
      min-width: 0;
    }

    .dash-head {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      justify-content: space-between;
      margin-bottom: var(--space-8);
    }

    .dash-head h1 {
      color: var(--c-primary);
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      margin-bottom: var(--space-2);
    }

    .dash-head p {
      margin: 0;
      color: var(--c-text-muted);
      font-size: var(--fs-body-lg);
    }

    .stats-grid,
    .overview-grid,
    .owner-grid {
      display: grid;
      gap: var(--space-5);
    }

    .stats-grid {
      margin-bottom: var(--space-8);
    }

    .stat-card,
    .promo-card,
    .performance,
    .messages-card,
    .reservation-item,
    .owner-listing,
    .empty-card {
      background: var(--c-surface-card);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
    }

    .stat-card {
      min-height: 190px;
      padding: var(--space-6);
      display: grid;
      align-content: center;
      gap: var(--space-3);
    }

    .stat-card > span {
      width: 56px;
      height: 56px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      background: var(--c-primary-fixed);
      color: var(--c-primary);
    }

    .stat-card.lime > span {
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
    }

    .stat-card small {
      color: var(--c-text-muted);
      font-size: 1rem;
    }

    .stat-card strong {
      color: var(--c-text-main);
      font-size: 2rem;
    }

    .promo-card {
      padding: var(--space-6);
      background: var(--c-primary);
      color: #fff;
      overflow: hidden;
    }

    .promo-card h2 {
      color: #fff;
      font-size: 1.8rem;
    }

    .promo-card p {
      max-width: 420px;
      color: rgba(255, 255, 255, 0.78);
      font-size: var(--fs-body-lg);
    }

    .section-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    .section-row h2,
    .dash-main > h2 {
      color: var(--c-text-main);
      font-size: 1.8rem;
      margin: 0;
    }

    .section-row button {
      border: 0;
      background: transparent;
      color: var(--c-primary);
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }

    .reservation-list {
      display: grid;
      gap: var(--space-4);
    }

    .reservation-item,
    .owner-listing {
      display: grid;
      gap: var(--space-4);
      align-items: center;
      padding: var(--space-4);
    }

    .item-thumb,
    .owner-listing img {
      width: 96px;
      height: 82px;
      border-radius: var(--radius-lg);
      object-fit: cover;
      background: var(--c-surface-container);
      color: var(--c-primary);
    }

    .item-thumb {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .reservation-item h3,
    .owner-listing h3 {
      color: var(--c-text-main);
      font-size: 1.12rem;
      margin: var(--space-2) 0 var(--space-1);
    }

    .reservation-item p,
    .owner-listing p {
      margin: 0;
      color: var(--c-text-muted);
    }

    .reservation-price,
    .reservation-actions,
    .owner-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      align-items: center;
      justify-content: flex-start;
    }

    .reservation-price {
      flex-direction: column;
      align-items: flex-start;
    }

    .reservation-price span { color: var(--c-text-main); }
    .reservation-price strong,
    .reservation-actions strong {
      color: var(--c-status-success);
      font-size: 1.2rem;
    }

    .side-panels {
      display: grid;
      gap: var(--space-5);
    }

    .performance,
    .messages-card,
    .empty-card {
      padding: var(--space-5);
    }

    .performance h2,
    .messages-card h2 {
      color: var(--c-primary);
      font-size: 1.25rem;
    }

    .performance h2 span { font-size: 20px; }

    .performance div {
      display: flex;
      justify-content: space-between;
      color: var(--c-text-muted);
      margin-top: var(--space-4);
    }

    progress {
      width: 100%;
      height: 9px;
      accent-color: var(--c-primary);
    }

    .messages-card p {
      color: var(--c-text-muted);
      line-height: 1.5;
    }

    .messages-card strong { color: var(--c-text-main); }

    .messages-card a {
      color: var(--c-primary);
      font-weight: 800;
      text-decoration: none;
    }

    .empty-card {
      color: var(--c-text-muted);
      text-align: center;
    }

    @media (min-width: 700px) {
      .dash-head { flex-direction: row; align-items: center; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .promo-card { grid-column: span 2; }
      .reservation-item,
      .owner-listing { grid-template-columns: auto 1fr auto; }
      .reservation-price { align-items: flex-end; }
      .reservation-actions,
      .owner-actions { justify-content: flex-end; }
    }

    @media (min-width: 1060px) {
      .dashboard-page { grid-template-columns: 300px 1fr; }
      .dash-sidebar { display: block; }
      .dash-main { padding: var(--space-8) var(--space-10) var(--space-10); }
      .stats-grid { grid-template-columns: 240px 240px 1fr; }
      .promo-card { grid-column: auto; }
      .overview-grid { grid-template-columns: minmax(0, 1fr) 330px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  tab = signal<DashboardTab>('overview');
  annonces = signal<Annonce[]>([]);
  mesReservations = signal<Reservation[]>([]);
  recues = signal<Reservation[]>([]);
  notice = signal<string | null>(null);

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() { this.refresh(); }

  refresh() {
    this.api.mesAnnonces().subscribe(a => this.annonces.set(a));
    this.api.mesReservations().subscribe(r => this.mesReservations.set(r));
    this.api.reservationsRecues().subscribe(r => this.recues.set(r));
  }

  totalGains(): number {
    return this.recues().filter(r => r.statut !== 'ANNULEE').reduce((sum, r) => sum + Number(r.montantTotal || 0), 0);
  }

  activeReservations(): number {
    return [...this.mesReservations(), ...this.recues()].filter(r => r.statut === 'CONFIRMEE' || r.statut === 'EN_ATTENTE').length;
  }

  statusLabel(s: ReservationStatut): string {
    return { EN_ATTENTE: 'En attente', CONFIRMEE: 'Confirmée', ANNULEE: 'Annulée', TERMINEE: 'Terminée' }[s];
  }

  changerStatut(id: number, value: ReservationStatut) {
    this.api.changerStatut(id, value).subscribe(() => {
      this.notice.set('Statut mis à jour.');
      this.refresh();
    });
  }

  payer(id: number) {
    this.api.payer(id).subscribe(() => {
      this.notice.set('Paiement simulé enregistré.');
      this.refresh();
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette annonce ?')) return;
    this.api.deleteAnnonce(id).subscribe(() => {
      this.notice.set('Annonce supprimée.');
      this.refresh();
    });
  }
}
