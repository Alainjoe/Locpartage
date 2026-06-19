import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Annonce } from '../core/models';

@Component({
  selector: 'app-annonce-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="listing-card">
      <a class="listing-image" [routerLink]="['/annonces', a.id]" aria-label="Voir l'annonce">
        @if (a.photos.length) {
          <img [src]="a.photos[0]" [alt]="a.titre" loading="lazy">
        } @else {
          <div class="image-fallback">
            <span class="material-symbols-outlined">photo_camera</span>
          </div>
        }
        <span class="badge badge-success availability">{{ a.disponible ? 'Disponible' : 'Indisponible' }}</span>
        <button class="favorite" type="button" aria-label="Ajouter aux favoris">
          <span class="material-symbols-outlined">favorite</span>
        </button>
      </a>

      <div class="listing-body">
        <div class="listing-meta">
          <span>{{ a.categorieNom || 'Objet' }}</span>
          <span class="rating"><span class="material-symbols-outlined filled">star</span>{{ rating(a.id) }}</span>
        </div>

        <a class="title" [routerLink]="['/annonces', a.id]">{{ a.titre }}</a>

        <p class="location">
          <span class="material-symbols-outlined">location_on</span>
          {{ a.ville || 'Québec' }}{{ a.codePostal ? ', QC' : '' }}
        </p>

        <div class="owner-price">
          <p>Propriétaire: <strong>{{ ownerShortName(a.proprietaireNom) }}</strong></p>
          <div class="price">
            <strong>{{ a.prixJour | number:'1.0-0' }}$</strong>
            <span>/ jour</span>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .listing-card {
      overflow: hidden;
      background: var(--c-surface-card);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
      transition: transform var(--t), box-shadow var(--t);
      min-width: 0;
    }

    .listing-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .listing-image {
      position: relative;
      display: block;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      color: inherit;
    }

    .listing-image:hover { text-decoration: none; }

    .listing-image img,
    .image-fallback {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: var(--c-surface-container);
      transition: transform 700ms ease;
    }

    .listing-card:hover img { transform: scale(1.04); }

    .image-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--c-text-muted);
    }

    .availability {
      position: absolute;
      top: 16px;
      left: 16px;
      text-transform: none;
      letter-spacing: 0;
      font-size: 0.78rem;
    }

    .favorite {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.92);
      color: var(--c-primary);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
    }

    .favorite .material-symbols-outlined { font-size: 22px; }

    .listing-body { padding: var(--space-5); }

    .listing-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      color: var(--c-text-muted);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-2);
    }

    .rating {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--c-status-warning);
      letter-spacing: 0;
      text-transform: none;
      font-weight: 700;
    }

    .rating span { font-size: 17px; }

    .title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      min-height: 2.7em;
      overflow: hidden;
      color: var(--c-text-main);
      font-size: 1.25rem;
      font-weight: 800;
      line-height: 1.32;
      text-decoration: none;
      margin-bottom: var(--space-2);
    }

    .title:hover {
      color: var(--c-primary);
      text-decoration: none;
    }

    .location {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--c-text-muted);
      margin: 0 0 var(--space-4);
    }

    .location span { font-size: 18px; }

    .owner-price {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: end;
      gap: var(--space-4);
    }

    .owner-price p {
      margin: 0;
      color: var(--c-text-muted);
      font-size: 0.92rem;
    }

    .owner-price strong { color: var(--c-text-main); }

    .price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      color: var(--c-primary);
      white-space: nowrap;
    }

    .price strong {
      color: var(--c-primary);
      font-size: 1.55rem;
      line-height: 1;
    }

    .price span {
      color: var(--c-text-muted);
      font-size: 0.9rem;
    }
  `]
})
export class AnnonceCardComponent {
  @Input({ required: true }) a!: Annonce;

  rating(id: number): string {
    return (4.6 + (id % 5) / 10).toFixed(1);
  }

  ownerShortName(name?: string): string {
    if (!name) return 'Membre';
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return parts[0];
    return `${parts[0]} ${parts[1][0]}.`;
  }
}
