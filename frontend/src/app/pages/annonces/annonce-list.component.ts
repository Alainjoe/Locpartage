import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Annonce, Categorie } from '../../core/models';
import { AnnonceCardComponent } from '../../shared/annonce-card.component';

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AnnonceCardComponent],
  template: `
    <section class="search-page">
      <aside class="filters">
        <div class="filters-head">
          <span class="material-symbols-outlined">tune</span>
          <strong>Filtres</strong>
        </div>

        <label class="filter-label">Recherche</label>
        <div class="input-icon">
          <span class="material-symbols-outlined">search</span>
          <input [(ngModel)]="q" placeholder="Perceuse, tente, robot...">
        </div>

        <label class="filter-label">Prix par jour</label>
        <input class="range" type="range" min="0" max="500" step="5" [(ngModel)]="prixMax">
        <div class="range-values"><span>0$</span><span>{{ prixMax || 500 }}$+</span></div>

        <label class="filter-label">Distance</label>
        <select class="select" [(ngModel)]="distance">
          <option>Moins de 10 km</option>
          <option>Moins de 25 km</option>
          <option>Moins de 50 km</option>
        </select>

        <label class="filter-label">Ville</label>
        <input class="input" [(ngModel)]="ville" placeholder="Montréal, Québec...">

        <label class="filter-label">Catégorie</label>
        <div class="category-filter">
          <button type="button" [class.active]="categorieId === null" (click)="categorieId = null">Toutes</button>
          @for (c of categories(); track c.id) {
            <button type="button" [class.active]="categorieId === c.id" (click)="categorieId = c.id">{{ c.nom }}</button>
          }
        </div>

        <button class="btn btn-primary btn-block" type="button" (click)="apply()">Appliquer</button>
        <button class="btn btn-ghost btn-block" type="button" (click)="reset()">Réinitialiser</button>
      </aside>

      <main class="results">
        <div class="results-head">
          <div>
            <h1>{{ total() || annonces().length }} résultats{{ q ? ' pour "' + q + '"' : '' }}</h1>
            <p>À {{ ville || 'Montréal, QC' }} dans un rayon de 25 km</p>
          </div>
          <label class="sort">
            <span>Trier par :</span>
            <select [(ngModel)]="sort">
              <option>Pertinence</option>
              <option>Prix bas</option>
              <option>Distance</option>
              <option>Plus récent</option>
            </select>
          </label>
        </div>

        @if (loading()) {
          <div class="spinner"></div>
        } @else if (annonces().length === 0) {
          <div class="empty-panel">
            <span class="material-symbols-outlined">search_off</span>
            <h2>Aucune annonce trouvée</h2>
            <p>Essayez une autre ville, une autre catégorie ou un prix maximum plus élevé.</p>
            <button class="btn btn-outline" type="button" (click)="reset()">Réinitialiser les filtres</button>
          </div>
        } @else {
          <div class="annonces-grid">
            @for (a of annonces(); track a.id) {
              <app-annonce-card [a]="a" />
            }
          </div>

          @if (totalPages() > 1) {
            <nav class="pagination" aria-label="Pagination">
              <button type="button" aria-label="Page précédente" [disabled]="page() === 0" (click)="goTo(page() - 1)">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              @for (n of pageList(); track $index) {
                @if (n === -1) {
                  <span>...</span>
                } @else {
                  <button type="button" [class.active]="n === page()" (click)="goTo(n)">{{ n + 1 }}</button>
                }
              }
              <button type="button" aria-label="Page suivante" [disabled]="page() >= totalPages() - 1" (click)="goTo(page() + 1)">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          }
        }
      </main>
    </section>
  `,
  styles: [`
    .search-page {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 48px var(--margin-mobile) var(--space-10);
      display: grid;
      gap: var(--space-6);
    }

    .filters {
      align-self: start;
      background: transparent;
    }

    .filters-head {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--c-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: var(--space-4);
    }

    .filter-label {
      display: block;
      margin: var(--space-5) 0 var(--space-2);
      color: var(--c-text-main);
      font-weight: 800;
    }

    .input-icon {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0 14px;
      min-height: 52px;
      background: #fff;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-lg);
    }

    .input-icon span { color: var(--c-text-muted); }

    .input-icon input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      font: inherit;
    }

    .range { width: 100%; accent-color: var(--c-primary); }

    .range-values {
      display: flex;
      justify-content: space-between;
      color: var(--c-text-muted);
      margin-top: var(--space-2);
    }

    .category-filter {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-bottom: var(--space-5);
    }

    .category-filter button {
      border: 1px solid var(--c-border-subtle);
      background: #fff;
      color: var(--c-text-muted);
      border-radius: var(--radius-pill);
      padding: 9px 14px;
      cursor: pointer;
      font: inherit;
    }

    .category-filter button.active {
      background: var(--c-primary);
      border-color: var(--c-primary);
      color: #fff;
    }

    .filters .btn + .btn { margin-top: var(--space-2); }

    .results-head {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .results-head h1 {
      color: var(--c-text-main);
      font-size: var(--fs-headline-lg);
      line-height: var(--lh-headline-lg);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .results-head p {
      color: var(--c-text-muted);
      font-size: var(--fs-body-md);
      margin: 0;
    }

    .sort {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--c-text-muted);
      font-weight: 700;
    }

    .sort select {
      min-width: 170px;
      height: 52px;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-pill);
      background: #fff;
      padding: 0 18px;
      font: inherit;
      color: var(--c-text-main);
    }

    .empty-panel {
      display: grid;
      justify-items: center;
      gap: var(--space-3);
      padding: var(--space-10);
      text-align: center;
      background: #fff;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
    }

    .empty-panel > span {
      font-size: 56px;
      color: var(--c-primary);
    }

    .empty-panel h2 {
      color: var(--c-text-main);
      margin: 0;
    }

    .empty-panel p {
      max-width: 460px;
      color: var(--c-text-muted);
      margin: 0 0 var(--space-3);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-2);
      margin-top: var(--space-8);
    }

    .pagination button {
      min-width: 46px;
      height: 46px;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-pill);
      background: #fff;
      color: var(--c-text-main);
      cursor: pointer;
      font: inherit;
      font-weight: 700;
    }

    .pagination button.active {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }

    @media (min-width: 980px) {
      .search-page {
        grid-template-columns: 280px 1fr;
        padding: 48px var(--margin-desktop) var(--space-10);
      }

      .results-head {
        flex-direction: row;
        align-items: start;
        justify-content: space-between;
      }
    }
  `]
})
export class AnnonceListComponent implements OnInit {
  categories = signal<Categorie[]>([]);
  annonces = signal<Annonce[]>([]);
  total = signal(0);
  totalPages = signal(0);
  page = signal(0);
  loading = signal(true);
  q = '';
  ville = '';
  distance = 'Moins de 25 km';
  sort = 'Pertinence';
  prixMax: number | null = 500;
  categorieId: number | null = null;

  readonly pageSize = 12;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.api.categories().subscribe(c => this.categories.set(c));
    this.route.queryParams.subscribe(p => {
      this.q = p['q'] || '';
      this.ville = p['ville'] || '';
      this.categorieId = p['categorieId'] ? Number(p['categorieId']) : null;
      this.prixMax = p['prixMax'] ? Number(p['prixMax']) : 500;
      this.page.set(p['page'] ? Number(p['page']) : 0);
      this.load();
    });
  }

  load() {
    this.loading.set(true);
    this.api.searchAnnonces({
      q: this.q,
      ville: this.ville,
      prixMax: this.prixMax && this.prixMax < 500 ? this.prixMax : null,
      categorieId: this.categorieId,
      page: this.page(),
      size: this.pageSize
    }).subscribe({
      next: p => {
        this.annonces.set(p.content);
        this.total.set(p.totalElements);
        this.totalPages.set(p.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  apply() {
    this.router.navigate(['/annonces'], {
      queryParams: {
        q: this.q || null,
        ville: this.ville || null,
        categorieId: this.categorieId,
        prixMax: this.prixMax && this.prixMax < 500 ? this.prixMax : null,
        page: null
      }
    });
  }

  reset() {
    this.q = '';
    this.ville = '';
    this.prixMax = 500;
    this.categorieId = null;
    this.router.navigate(['/annonces']);
  }

  goTo(p: number) {
    if (p < 0 || p >= this.totalPages() || p === this.page()) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: p === 0 ? null : p },
      queryParamsHandling: 'merge'
    });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pageList(): number[] {
    const tp = this.totalPages();
    const cur = this.page();
    if (tp <= 7) return Array.from({ length: tp }, (_, i) => i);
    const pages = new Set<number>([0, tp - 1, cur, cur - 1, cur + 1]);
    const sorted = [...pages].filter(n => n >= 0 && n < tp).sort((a, b) => a - b);
    const out: number[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push(-1);
      out.push(sorted[i]);
    }
    return out;
  }
}
