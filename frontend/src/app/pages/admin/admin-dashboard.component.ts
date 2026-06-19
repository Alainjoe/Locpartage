import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Annonce, Categorie } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="admin-page">
      <aside class="admin-sidebar">
        <div class="admin-brand">Loc'Partage <span>Admin</span></div>
        <button class="active" type="button"><span class="material-symbols-outlined">dashboard</span> Vue d'ensemble</button>
        <button type="button"><span class="material-symbols-outlined">group</span> Utilisateurs</button>
        <button type="button"><span class="material-symbols-outlined">inventory_2</span> Annonces</button>
        <button type="button"><span class="material-symbols-outlined">gavel</span> Litiges</button>
        <button type="button"><span class="material-symbols-outlined">receipt_long</span> Transactions</button>
      </aside>

      <main class="admin-main">
        <header class="admin-head">
          <div>
            <h1>Tableau de bord</h1>
            <p>Modération de la plateforme.</p>
          </div>
        </header>

        <div class="admin-stats">
          <article>
            <span class="material-symbols-outlined">inventory_2</span>
            <small>Annonces totales</small>
            <strong>{{ total() }}</strong>
          </article>
          <article>
            <span class="material-symbols-outlined">check_circle</span>
            <small>Annonces disponibles</small>
            <strong>{{ disponibles() }}</strong>
          </article>
          <article>
            <span class="material-symbols-outlined">category</span>
            <small>Catégories</small>
            <strong>{{ categories().length }}</strong>
          </article>
        </div>

        <section class="table-card">
          <div class="section-row">
            <div>
              <h2>Gestion des annonces</h2>
              <p>Modérez, approuvez ou signalez les publications de la plateforme.</p>
            </div>
            <div class="admin-filters">
              <input [(ngModel)]="q" placeholder="Rechercher un titre...">
              <select [(ngModel)]="categorieId">
                <option [ngValue]="null">Toutes les catégories</option>
                @for (c of categories(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nom }}</option>
                }
              </select>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Propriétaire</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (a of filtered(); track a.id) {
                  <tr>
                    <td>
                      @if (a.photos.length) { <img [src]="a.photos[0]" [alt]="a.titre"> }
                    </td>
                    <td><strong>{{ a.titre }}</strong></td>
                    <td>{{ a.proprietaireNom }}</td>
                    <td>{{ a.categorieNom }}</td>
                    <td><strong class="price">{{ a.prixJour | number:'1.0-0' }}$ / jour</strong></td>
                    <td>
                      <span class="badge" [class.badge-success]="a.disponible" [class.badge-muted]="!a.disponible">
                        {{ a.disponible ? 'Disponible' : 'Indisponible' }}
                      </span>
                    </td>
                    <td class="actions">
                      <button type="button" aria-label="Supprimer" (click)="supprimer(a.id)"><span class="material-symbols-outlined">delete</span></button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="7" class="empty-row">Aucune annonce.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </section>
  `,
  styles: [`
    .admin-page {
      display: grid;
      min-height: calc(100vh - 80px);
      max-width: 1600px;
      margin: 0 auto;
    }

    .admin-sidebar {
      display: none;
      padding: var(--space-8) var(--space-5);
      background: #fff;
      border-right: 1px solid var(--c-border-subtle);
    }

    .admin-brand {
      color: var(--c-primary);
      font-size: 1.4rem;
      font-weight: 900;
      margin-bottom: var(--space-8);
    }

    .admin-brand span {
      padding: 4px 10px;
      margin-left: var(--space-2);
      border-radius: var(--radius-pill);
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .admin-sidebar button {
      width: 100%;
      min-height: 58px;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      border: 0;
      border-radius: var(--radius-xl);
      background: transparent;
      color: var(--c-text-muted);
      font: inherit;
      font-weight: 800;
      padding: 0 var(--space-4);
      cursor: pointer;
      margin-bottom: var(--space-2);
    }

    .admin-sidebar button.active,
    .admin-sidebar button:hover {
      background: var(--c-primary);
      color: #fff;
    }

    .admin-main {
      padding: var(--space-6) var(--margin-mobile) var(--space-10);
      min-width: 0;
    }

    .admin-head,
    .section-row {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      justify-content: space-between;
      margin-bottom: var(--space-6);
    }

    .admin-head h1 {
      color: var(--c-primary);
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: var(--space-1);
    }

    .admin-head p,
    .section-row p {
      color: var(--c-text-muted);
      margin: 0;
    }

    .admin-stats,
    .admin-grid {
      display: grid;
      gap: var(--space-5);
      margin-bottom: var(--space-8);
    }

    .admin-stats article,
    .chart-card,
    .alerts-card,
    .table-card {
      background: #fff;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
    }

    .admin-stats article {
      position: relative;
      padding: var(--space-6);
      display: grid;
      gap: var(--space-3);
    }

    .admin-stats article > span {
      width: 56px;
      height: 56px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      background: var(--c-primary-fixed);
      color: var(--c-primary);
    }

    .admin-stats .warn > span {
      background: #fff3df;
      color: var(--c-status-warning);
    }

    .admin-stats small {
      color: var(--c-text-muted);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .admin-stats strong {
      color: var(--c-text-main);
      font-size: 2rem;
    }

    .admin-stats em {
      position: absolute;
      right: 24px;
      top: 32px;
      padding: 6px 12px;
      border-radius: var(--radius-pill);
      background: #dcfce7;
      color: #15803d;
      font-style: normal;
      font-weight: 800;
    }

    .admin-stats .warn em {
      background: #fff3df;
      color: var(--c-status-warning);
    }

    .chart-card,
    .alerts-card,
    .table-card {
      padding: var(--space-6);
    }

    .section-row h2 {
      color: var(--c-text-main);
      font-size: 1.6rem;
      margin-bottom: var(--space-1);
    }

    .section-row select,
    .admin-filters input,
    .admin-filters select {
      min-height: 48px;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-lg);
      background: var(--c-surface-container-low);
      padding: 0 14px;
      font: inherit;
    }

    .bars {
      min-height: 260px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--space-5);
      align-items: end;
      padding-top: var(--space-6);
    }

    .bars div {
      height: 230px;
      display: grid;
      align-items: end;
      justify-items: center;
      gap: var(--space-3);
      color: var(--c-text-muted);
    }

    .bars span {
      width: 100%;
      max-width: 68px;
      min-height: 42px;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      background: var(--c-primary-fixed);
    }

    .bars span.active {
      background: var(--c-primary-container);
      box-shadow: var(--shadow);
    }

    .alerts-card h2 {
      color: var(--c-text-main);
      font-size: 1.6rem;
    }

    .alerts-card article {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--space-4);
      padding: var(--space-4);
      border-radius: var(--radius-xl);
      background: var(--c-error-container);
      color: var(--c-on-error-container);
      margin-top: var(--space-4);
    }

    .alerts-card article.soft {
      background: #fff8e8;
      color: #92400e;
    }

    .alerts-card article > span {
      width: 48px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.55);
    }

    .alerts-card p { margin: var(--space-2) 0; }

    .alerts-card button {
      border: 0;
      background: transparent;
      color: inherit;
      font-weight: 900;
      text-transform: uppercase;
      cursor: pointer;
      margin-right: var(--space-2);
    }

    .admin-filters {
      display: grid;
      gap: var(--space-3);
    }

    .table-wrap {
      overflow-x: auto;
      margin-inline: calc(var(--space-6) * -1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }

    th,
    td {
      padding: var(--space-4) var(--space-5);
      text-align: left;
      border-top: 1px solid var(--c-border-subtle);
    }

    th {
      color: var(--c-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--c-surface-container-low);
    }

    td img {
      width: 74px;
      height: 58px;
      border-radius: var(--radius);
      object-fit: cover;
    }

    .price { color: var(--c-primary); }

    .actions button {
      width: 36px;
      height: 36px;
      border: 0;
      background: transparent;
      color: var(--c-text-muted);
      cursor: pointer;
    }

    @media (min-width: 760px) {
      .admin-main { padding-inline: var(--space-10); }
      .admin-head,
      .section-row { flex-direction: row; align-items: center; }
      .admin-stats { grid-template-columns: repeat(2, 1fr); }
      .admin-filters { grid-template-columns: minmax(240px, 1fr) 240px; }
    }

    @media (min-width: 1120px) {
      .admin-page { grid-template-columns: 300px 1fr; }
      .admin-sidebar { display: block; }
      .admin-stats { grid-template-columns: repeat(4, 1fr); }
      .admin-grid { grid-template-columns: minmax(0, 1fr) 340px; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  annonces = signal<Annonce[]>([]);
  categories = signal<Categorie[]>([]);
  total = signal(0);
  q = '';
  categorieId: number | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.categories().subscribe(c => this.categories.set(c));
    this.api.searchAnnonces({ size: 200 }).subscribe(p => {
      this.annonces.set(p.content);
      this.total.set(p.totalElements);
    });
  }

  disponibles(): number {
    return this.annonces().filter(a => a.disponible).length;
  }

  filtered(): Annonce[] {
    const q = this.q.trim().toLowerCase();
    return this.annonces().filter(a => {
      const matchesQ = !q || a.titre.toLowerCase().includes(q) || a.proprietaireNom.toLowerCase().includes(q);
      const matchesCat = this.categorieId === null || a.categorieId === this.categorieId;
      return matchesQ && matchesCat;
    });
  }

  supprimer(id: number) {
    if (!confirm('Supprimer cette annonce ?')) return;
    this.api.deleteAnnonce(id).subscribe(() => this.load());
  }
}
