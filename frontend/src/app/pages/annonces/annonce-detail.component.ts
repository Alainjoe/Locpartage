import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Annonce } from '../../core/models';
import { AnnonceCardComponent } from '../../shared/annonce-card.component';

@Component({
  selector: 'app-annonce-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AnnonceCardComponent],
  template: `
    <section class="detail-page">
      @if (loading()) {
        <div class="spinner"></div>
      } @else if (annonce()) {
        <nav class="breadcrumb">
          <a routerLink="/annonces">Objets</a>
          <span>/</span>
          <a [routerLink]="['/annonces']" [queryParams]="{ categorieId: annonce()!.categorieId }">{{ annonce()!.categorieNom }}</a>
          <span>/</span>
          <strong>{{ annonce()!.titre }}</strong>
        </nav>

        <header class="detail-head">
          <div>
            <h1>{{ annonce()!.titre }}</h1>
            <p>
              <span>{{ annonce()!.categorieNom }}</span>
              <span>•</span>
              <span>{{ annonce()!.ville || 'Québec' }}</span>
            </p>
          </div>
        </header>

        <div class="gallery-grid">
          <button class="gallery-main" type="button" (click)="activeIdx.set(0)">
            @if (mainPhoto()) {
              <img [src]="mainPhoto()!" [alt]="annonce()!.titre">
            } @else {
              <span class="material-symbols-outlined">photo_camera</span>
            }
          </button>
          <div class="gallery-side">
            @for (p of gallerySide(); track p; let i = $index) {
              <button type="button" (click)="activeIdx.set(i + 1)">
                <img [src]="p" [alt]="annonce()!.titre + ' photo ' + (i + 2)">
              </button>
            }
          </div>
        </div>

        <div class="detail-layout">
          <main class="content">
            <section class="content-section">
              <h2>Description</h2>
              <p class="description">{{ annonce()!.description }}</p>
            </section>

            <section class="owner-card">
              <div class="owner-avatar">{{ ownerInitials() }}</div>
              <div>
                <h2>{{ annonce()!.proprietaireNom }}</h2>
                <p>Propriétaire sur Loc'Partage</p>
              </div>
              @if (!isOwner()) {
                <button class="btn btn-outline" type="button" (click)="contacterProprietaire()">
                  <span class="material-symbols-outlined">chat</span>
                  Contacter
                </button>
              }
            </section>
          </main>

          <aside class="booking-card">
            <div class="booking-price">
              <strong>{{ annonce()!.prixJour | number:'1.0-0' }}$</strong>
              <span>/ jour</span>
              @if (annonce()!.disponible) {
                <em>Disponible</em>
              } @else {
                <em class="off">Indisponible</em>
              }
            </div>

            @if (msg()) {
              <div class="alert" [class.alert-error]="!success()" [class.alert-success]="success()">
                {{ msg() }}
              </div>
            }

            <h3>Dates de location</h3>
            <div class="date-grid">
              <label>
                <span>Du</span>
                <input class="input" type="date" [(ngModel)]="dateDebut" [min]="today">
              </label>
              <label>
                <span>Au</span>
                <input class="input" type="date" [(ngModel)]="dateFin" [min]="dateDebut || today">
              </label>
            </div>

            <label class="message-field">
              <span>Message au propriétaire</span>
              <textarea class="textarea" [(ngModel)]="messageOptionnel" rows="3" placeholder="Bonjour, je souhaite réserver..."></textarea>
            </label>

            <div class="price-lines">
              <div><span>{{ annonce()!.prixJour | number:'1.0-0' }}$ × {{ jours() || 1 }} jour{{ (jours() || 1) > 1 ? 's' : '' }}</span><strong>{{ baseTotal() | number:'1.0-0' }}$</strong></div>
              <div><span>Frais de service Loc'Partage</span><strong>{{ serviceFee() | number:'1.0-0' }}$</strong></div>
              @if (annonce()!.caution) {
                <div><span>Caution remboursable</span><strong>{{ annonce()!.caution | number:'1.0-0' }}$</strong></div>
              }
              <div class="total"><span>Total</span><strong>{{ totalEstime() | number:'1.0-0' }}$</strong></div>
            </div>

            @if (auth.isLogged() && !isOwner()) {
              <button class="btn btn-primary btn-block" type="button" (click)="reserver()" [disabled]="!canReserve() || submitting()">
                {{ submitting() ? 'Réservation...' : 'Réserver maintenant' }}
              </button>
            } @else if (!auth.isLogged()) {
              <a routerLink="/login" class="btn btn-primary btn-block">Connectez-vous pour réserver</a>
            } @else {
              <div class="alert alert-info">C'est votre annonce.</div>
            }

            <p class="booking-note">Vous ne serez débité qu'après confirmation du propriétaire.</p>
          </aside>
        </div>

        @if (related().length) {
          <section class="similar">
            <h2>Annonces similaires</h2>
            <div class="annonces-grid">
              @for (a of related(); track a.id) {
                <app-annonce-card [a]="a" />
              }
            </div>
          </section>
        }
      }
    </section>
  `,
  styles: [`
    .detail-page {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: var(--space-6) var(--margin-mobile) var(--space-10);
    }

    .breadcrumb {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      align-items: center;
      margin-bottom: var(--space-4);
      color: var(--c-text-muted);
      font-size: 0.92rem;
    }

    .breadcrumb a,
    .breadcrumb strong {
      color: var(--c-text-muted);
      font-weight: 500;
      text-decoration: none;
    }

    .detail-head {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      justify-content: space-between;
      margin-bottom: var(--space-5);
    }

    .detail-head h1 {
      color: var(--c-primary);
      font-size: var(--fs-display-lg);
      line-height: var(--lh-display-lg);
      font-weight: 700;
      margin-bottom: var(--space-2);
    }

    .detail-head p {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2);
      margin: 0;
      color: var(--c-text-main);
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--c-status-warning);
      font-weight: 700;
    }

    .rating span { font-size: 18px; }

    .gallery-grid {
      display: grid;
      gap: var(--space-4);
      margin-bottom: var(--space-8);
    }

    .gallery-main,
    .gallery-side button {
      overflow: hidden;
      border: 0;
      background: var(--c-surface-container);
      padding: 0;
      cursor: pointer;
    }

    .gallery-main {
      min-height: 500px;
      border-radius: var(--radius-3xl);
      color: var(--c-primary);
    }

    .gallery-main img,
    .gallery-side img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 700ms ease;
    }

    .gallery-main:hover img,
    .gallery-side button:hover img { transform: scale(1.04); }

    .gallery-side {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }

    .gallery-side button {
      min-height: 242px;
      border-radius: var(--radius-xl);
    }

    .detail-layout {
      display: grid;
      gap: var(--space-8);
      align-items: start;
    }

    .content-section h2,
    .spec-card h2,
    .similar h2 {
      color: var(--c-primary);
      font-size: 1.6rem;
      margin-bottom: var(--space-4);
    }

    .description {
      max-width: 760px;
      color: var(--c-text-main);
      line-height: 1.8;
      margin: 0;
    }

    .spec-card,
    .owner-card,
    .review,
    .booking-card {
      background: var(--c-surface-card);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
    }

    .spec-card {
      margin-top: var(--space-6);
      padding: var(--space-6);
    }

    .spec-grid {
      display: grid;
      gap: var(--space-4);
    }

    .spec {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .spec > span {
      color: var(--c-secondary);
    }

    .spec small {
      display: block;
      color: var(--c-text-muted);
    }

    .spec strong {
      color: var(--c-text-main);
    }

    .owner-card {
      display: grid;
      gap: var(--space-4);
      align-items: center;
      margin-top: var(--space-6);
      padding: var(--space-5);
      border-radius: 0;
      border-inline: 0;
      box-shadow: none;
      background: transparent;
    }

    .owner-avatar {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-pill);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--c-primary);
      color: #fff;
      font-weight: 900;
      font-size: 1.2rem;
    }

    .owner-card h2 {
      color: var(--c-primary);
      font-size: 1.25rem;
      margin: 0;
    }

    .owner-card p {
      color: var(--c-text-muted);
      margin: 0 0 var(--space-2);
    }

    .review {
      margin: 0;
      padding: var(--space-5);
      color: var(--c-text-main);
    }

    .review p {
      margin: 0 0 var(--space-3);
      font-style: italic;
    }

    .review footer { color: var(--c-text-muted); }

    .booking-card {
      padding: var(--space-5);
      align-self: start;
    }

    .booking-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-1);
      margin-bottom: var(--space-5);
    }

    .booking-price strong {
      color: var(--c-primary);
      font-size: 2.4rem;
      line-height: 1;
    }

    .booking-price span { color: var(--c-text-muted); }

    .booking-price em {
      margin-left: auto;
      padding: 6px 12px;
      border-radius: var(--radius-pill);
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
      font-style: normal;
      font-size: 0.82rem;
    }

    .booking-card h3 {
      color: var(--c-text-main);
      font-size: 0.9rem;
      margin-bottom: var(--space-3);
    }

    .date-grid {
      display: grid;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .date-grid label,
    .message-field {
      display: grid;
      gap: var(--space-1);
      color: var(--c-text-muted);
      font-weight: 700;
      font-size: 0.82rem;
    }

    .mini-calendar {
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .calendar-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }

    .calendar-head button {
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: var(--radius-pill);
      background: var(--c-surface-container-low);
      color: var(--c-primary);
      cursor: pointer;
    }

    .calendar-head span { font-size: 18px; }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
      text-align: center;
      color: var(--c-text-muted);
      font-size: 0.82rem;
    }

    .calendar-grid span {
      min-height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
    }

    .calendar-grid .selected {
      background: var(--c-secondary);
      color: #fff;
      font-weight: 800;
    }

    .calendar-grid .soft {
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
      font-weight: 800;
    }

    .message-field { margin-bottom: var(--space-4); }

    .price-lines {
      display: grid;
      gap: var(--space-3);
      margin: var(--space-5) 0;
      color: var(--c-text-muted);
    }

    .price-lines div {
      display: flex;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .price-lines strong {
      color: var(--c-text-main);
      white-space: nowrap;
    }

    .price-lines .total {
      padding-top: var(--space-3);
      border-top: 1px solid var(--c-border-subtle);
      color: var(--c-primary);
      font-weight: 800;
      font-size: 1.1rem;
    }

    .price-lines .total strong { color: var(--c-primary); }

    .booking-note {
      margin: var(--space-3) 0 var(--space-4);
      text-align: center;
      color: var(--c-text-muted);
      font-size: 0.82rem;
    }

    .booking-card ul {
      display: grid;
      gap: var(--space-3);
      margin: 0;
      padding: var(--space-4) 0 0;
      border-top: 1px solid var(--c-border-subtle);
      list-style: none;
      color: var(--c-text-main);
      font-size: 0.9rem;
    }

    .booking-card li {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    .booking-card li span {
      color: var(--c-secondary);
      font-size: 19px;
    }

    .similar {
      margin-top: var(--space-10);
    }

    @media (min-width: 760px) {
      .detail-page { padding-inline: var(--margin-desktop); }
      .detail-head { flex-direction: row; align-items: end; }
      .gallery-grid { grid-template-columns: 1.3fr 1fr; }
      .gallery-side { grid-template-columns: repeat(2, 1fr); }
      .gallery-side button:last-child { grid-column: span 2; }
      .spec-grid { grid-template-columns: repeat(2, 1fr); }
      .owner-card { grid-template-columns: auto 1fr auto; }
      .date-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 759px) {
      .detail-head h1 {
        font-size: var(--fs-display-lg-mobile);
        line-height: 1.2;
      }
      .gallery-main { min-height: 320px; }
      .gallery-side button { min-height: 120px; }
    }

    @media (min-width: 1040px) {
      .detail-layout { grid-template-columns: minmax(0, 1fr) 350px; }
      .booking-card { position: sticky; top: 104px; }
    }
  `]
})
export class AnnonceDetailComponent implements OnInit {
  annonce = signal<Annonce | null>(null);
  related = signal<Annonce[]>([]);
  loading = signal(true);
  activeIdx = signal(0);

  today = new Date().toISOString().substring(0, 10);
  dateDebut = '';
  dateFin = '';
  messageOptionnel = '';
  submitting = signal(false);
  msg = signal<string | null>(null);
  success = signal(false);

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getAnnonce(id).subscribe({
      next: a => {
        this.annonce.set(a);
        this.loading.set(false);
        this.loadRelated(a);
      },
      error: () => { this.loading.set(false); this.router.navigate(['/annonces']); }
    });
  }

  loadRelated(a: Annonce) {
    this.api.searchAnnonces({ categorieId: a.categorieId, size: 4 }).subscribe(p => {
      this.related.set(p.content.filter(item => item.id !== a.id).slice(0, 4));
    });
  }

  mainPhoto(): string | null {
    const a = this.annonce();
    return a?.photos?.[this.activeIdx()] || a?.photos?.[0] || null;
  }

  gallerySide(): string[] {
    const photos = this.annonce()?.photos || [];
    return photos.slice(1, 4);
  }

  ownerInitials(): string {
    return (this.annonce()?.proprietaireNom || 'LP')
      .split(/\s+/)
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }

  isOwner(): boolean {
    return this.annonce()?.proprietaireId === this.auth.user()?.id;
  }

  jours(): number {
    if (!this.dateDebut || !this.dateFin) return 0;
    const d1 = new Date(this.dateDebut).getTime();
    const d2 = new Date(this.dateFin).getTime();
    if (d2 < d1) return 0;
    return Math.round((d2 - d1) / 86400000) + 1;
  }

  baseTotal(): number {
    return (this.annonce()?.prixJour || 0) * (this.jours() || 1);
  }

  serviceFee(): number {
    return Math.max(5, Math.round(this.baseTotal() * 0.1));
  }

  totalEstime(): number {
    return this.baseTotal() + this.serviceFee();
  }

  canReserve(): boolean {
    return !!this.dateDebut && !!this.dateFin && this.jours() > 0;
  }

  reserver() {
    if (!this.annonce()) return;
    this.submitting.set(true);
    this.msg.set(null);
    this.api.reserver({
      annonceId: this.annonce()!.id,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      messageOptionnel: this.messageOptionnel || null
    }).subscribe({
      next: () => {
        this.success.set(true);
        this.msg.set('Réservation créée. Suivez-la dans votre tableau de bord.');
        this.submitting.set(false);
        setTimeout(() => this.router.navigate(['/dashboard']), 1200);
      },
      error: e => {
        this.success.set(false);
        this.msg.set(e?.error?.message || 'Erreur lors de la réservation');
        this.submitting.set(false);
      }
    });
  }

  contacterProprietaire() {
    const a = this.annonce();
    if (!a) return;
    if (!this.auth.isLogged()) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/messages?to=${a.proprietaireId}&annonceId=${a.id}`
        }
      });
      return;
    }
    this.router.navigate(['/messages'], {
      queryParams: {
        to: a.proprietaireId,
        annonceId: a.id,
        nom: a.proprietaireNom
      }
    });
  }
}
