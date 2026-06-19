import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Categorie } from '../../core/models';

@Component({
  selector: 'app-annonce-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="publish-page">
      <header class="publish-head">
        <span class="badge badge-eco">Nouvelle annonce</span>
        <h1>Publier un objet à louer</h1>
        <p>Ajoutez les informations essentielles, un prix clair et des photos rassurantes pour recevoir vos premières demandes.</p>
      </header>

      @if (err()) { <div class="alert alert-error">{{ err() }}</div> }

      <div class="publish-layout">
        <form class="publish-form" (ngSubmit)="submit()">
          <div class="progress">
            <span class="active">1. Infos</span>
            <span>2. Prix</span>
            <span>3. Photos</span>
          </div>

          <section class="form-panel">
            <h2>Informations principales</h2>
            <div class="form-group">
              <label>Titre *</label>
              <input class="input" [(ngModel)]="titre" name="titre" required maxlength="160" placeholder="Ex. Perceuse Bosch Pro 18V">
            </div>

            <div class="form-group">
              <label>Catégorie *</label>
              <select class="select" [(ngModel)]="categorieId" name="categorieId" required>
                <option [ngValue]="null">Choisir une catégorie</option>
                @for (c of categories(); track c.id) {
                  <option [ngValue]="c.id">{{ c.nom }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea class="textarea" [(ngModel)]="description" name="description" required
                        placeholder="Décrivez l'état, les accessoires inclus et les conditions de remise."></textarea>
            </div>
          </section>

          <section class="form-panel">
            <h2>Prix et localisation</h2>
            <div class="row">
              <div class="form-group">
                <label>Prix par jour ($) *</label>
                <input class="input" type="number" step="0.01" min="0" [(ngModel)]="prixJour" name="prixJour" required>
              </div>
              <div class="form-group">
                <label>Caution ($)</label>
                <input class="input" type="number" step="0.01" min="0" [(ngModel)]="caution" name="caution">
              </div>
            </div>

            <div class="row">
              <div class="form-group">
                <label>Ville</label>
                <input class="input" [(ngModel)]="ville" name="ville" placeholder="Montréal">
              </div>
              <div class="form-group">
                <label>Code postal</label>
                <input class="input" [(ngModel)]="codePostal" name="codePostal" placeholder="H2J 1A1">
              </div>
            </div>
          </section>

          <section class="form-panel">
            <h2>Photos</h2>
            <label class="upload-zone">
              <span class="material-symbols-outlined">cloud_upload</span>
              <strong>Ajoutez des URLs de photos</strong>
              <small>Une URL par ligne. Utilisez des images nettes et lumineuses.</small>
              <textarea [(ngModel)]="photosStr" name="photosStr" rows="4" placeholder="https://exemple.com/photo1.jpg"></textarea>
            </label>
          </section>

          <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="submitting()">
              <span class="material-symbols-outlined">publish</span>
              <span [textContent]="submitting() ? 'Publication...' : publishButtonLabel"></span>
            </button>
            <button type="button" class="btn btn-ghost" (click)="router.navigate(['/dashboard'])">Annuler</button>
          </div>
        </form>

        <aside class="preview">
          <h2>Aperçu</h2>
          <div class="preview-card">
            <div class="preview-image">
              @if (previewPhoto()) {
                <img [src]="previewPhoto()!" [alt]="titre || 'Aperçu annonce'">
              } @else {
                <span class="material-symbols-outlined">add_photo_alternate</span>
              }
              <span class="badge badge-success">Disponible</span>
            </div>
            <div class="preview-body">
              <small>{{ selectedCategoryName() }}</small>
              <h3>{{ titre || 'Titre de votre objet' }}</h3>
              <p><span class="material-symbols-outlined">location_on</span>{{ ville || 'Votre ville' }}</p>
              <div class="preview-price">
                <strong>{{ (prixJour || 0) | number:'1.0-0' }}$</strong>
                <span>/ jour</span>
              </div>
            </div>
          </div>

          <div class="tips">
            <h3>Conseils rapides</h3>
            <p>Montrez l'objet sous plusieurs angles, indiquez les accessoires inclus et précisez les horaires de remise possibles.</p>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .publish-page {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: var(--space-8) var(--margin-mobile) var(--space-10);
    }

    .publish-head {
      max-width: 760px;
      margin-bottom: var(--space-8);
    }

    .publish-head h1 {
      color: var(--c-primary);
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      line-height: 1.08;
      margin: var(--space-4) 0 var(--space-3);
    }

    .publish-head p {
      color: var(--c-text-muted);
      font-size: var(--fs-body-lg);
      margin: 0;
    }

    .publish-layout {
      display: grid;
      gap: var(--space-6);
      align-items: start;
    }

    .publish-form,
    .preview-card,
    .tips {
      background: var(--c-surface-card);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
    }

    .publish-form { padding: var(--space-5); }

    .progress {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
      margin-bottom: var(--space-6);
    }

    .progress span {
      padding: 10px;
      border-radius: var(--radius-pill);
      background: var(--c-surface-container-low);
      color: var(--c-text-muted);
      text-align: center;
      font-weight: 800;
      font-size: 0.82rem;
    }

    .progress .active {
      background: var(--c-primary);
      color: #fff;
    }

    .form-panel {
      padding: var(--space-5) 0;
      border-top: 1px solid var(--c-border-subtle);
    }

    .form-panel h2,
    .preview h2 {
      color: var(--c-primary);
      font-size: 1.45rem;
      margin-bottom: var(--space-4);
    }

    .row {
      display: grid;
      gap: var(--space-3);
    }

    .upload-zone {
      display: grid;
      justify-items: center;
      gap: var(--space-2);
      padding: var(--space-6);
      text-align: center;
      border: 1px dashed var(--c-outline-variant);
      border-radius: var(--radius-xl);
      background: var(--c-surface-container-low);
      color: var(--c-text-muted);
    }

    .upload-zone > span {
      width: 56px;
      height: 56px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-pill);
      background: #fff;
      color: var(--c-primary);
      box-shadow: var(--shadow-sm);
      font-size: 30px;
    }

    .upload-zone strong { color: var(--c-text-main); }

    .upload-zone textarea {
      width: 100%;
      min-height: 110px;
      margin-top: var(--space-3);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-3);
      font: inherit;
      resize: vertical;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      padding-top: var(--space-5);
      border-top: 1px solid var(--c-border-subtle);
    }

    .preview {
      display: grid;
      gap: var(--space-5);
    }

    .preview-card { overflow: hidden; padding: 0; }

    .preview-image {
      position: relative;
      aspect-ratio: 4 / 3;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--c-surface-container);
      color: var(--c-primary);
    }

    .preview-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-image .badge {
      position: absolute;
      left: 16px;
      top: 16px;
    }

    .preview-body { padding: var(--space-5); }

    .preview-body small {
      color: var(--c-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .preview-body h3 {
      color: var(--c-text-main);
      margin: var(--space-2) 0;
      font-size: 1.35rem;
    }

    .preview-body p {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--c-text-muted);
      margin: 0 0 var(--space-4);
    }

    .preview-body p span { font-size: 18px; }

    .preview-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-1);
      color: var(--c-primary);
    }

    .preview-price strong {
      color: var(--c-primary);
      font-size: 2rem;
    }

    .preview-price span { color: var(--c-text-muted); }

    .tips { padding: var(--space-5); }

    .tips h3 {
      color: var(--c-text-main);
      font-size: 1.1rem;
      margin-bottom: var(--space-2);
    }

    .tips p {
      margin: 0;
      color: var(--c-text-muted);
    }

    @media (min-width: 700px) {
      .publish-page { padding-inline: var(--margin-desktop); }
      .row { grid-template-columns: 1fr 1fr; }
    }

    @media (min-width: 1020px) {
      .publish-layout { grid-template-columns: minmax(0, 1fr) 360px; }
      .preview { position: sticky; top: 104px; }
    }
  `]
})
export class AnnonceFormComponent implements OnInit {
  categories = signal<Categorie[]>([]);
  titre = '';
  description = '';
  prixJour: number | null = null;
  caution: number | null = null;
  ville = '';
  codePostal = '';
  categorieId: number | null = null;
  photosStr = '';
  submitting = signal(false);
  err = signal<string | null>(null);
  readonly publishButtonLabel = "Publier l'annonce";

  constructor(private api: ApiService, public router: Router) {}

  ngOnInit() {
    this.api.categories().subscribe(c => this.categories.set(c));
  }

  previewPhoto(): string | null {
    return this.photosStr.split('\n').map(s => s.trim()).filter(Boolean)[0] || null;
  }

  selectedCategoryName(): string {
    return this.categories().find(c => c.id === this.categorieId)?.nom || 'Catégorie';
  }

  submit() {
    if (!this.titre || !this.description || !this.prixJour || !this.categorieId) {
      this.err.set('Veuillez remplir les champs obligatoires');
      return;
    }
    this.submitting.set(true);
    const photos = this.photosStr.split('\n').map(s => s.trim()).filter(s => s);
    this.api.createAnnonce({
      titre: this.titre,
      description: this.description,
      prixJour: this.prixJour,
      caution: this.caution,
      ville: this.ville,
      codePostal: this.codePostal,
      categorieId: this.categorieId,
      photos
    }).subscribe({
      next: a => this.router.navigate(['/annonces', a.id]),
      error: e => {
        this.err.set(e?.error?.message || 'Erreur lors de la publication');
        this.submitting.set(false);
      }
    });
  }
}
