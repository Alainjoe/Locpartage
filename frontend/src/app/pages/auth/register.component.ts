import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="register-page">
      <div class="register-card">
        <span class="badge badge-eco">Communauté Loc'Partage</span>
        <h1>Créer votre compte</h1>
        <p>Publiez, réservez et échangez avec des voisins de confiance.</p>

        @if (err()) { <div class="alert alert-error">{{ err() }}</div> }

        <form (ngSubmit)="submit()">
          <div class="row">
            <label>
              <span>Prénom *</span>
              <input class="input" [(ngModel)]="prenom" name="prenom" required>
            </label>
            <label>
              <span>Nom *</span>
              <input class="input" [(ngModel)]="nom" name="nom" required>
            </label>
          </div>

          <label>
            <span>Email *</span>
            <input class="input" type="email" [(ngModel)]="email" name="email" required autocomplete="email">
          </label>

          <label>
            <span>Mot de passe * (min. 8)</span>
            <input class="input" type="password" [(ngModel)]="password" name="password" required minlength="8" autocomplete="new-password">
          </label>

          <div class="row">
            <label>
              <span>Ville</span>
              <input class="input" [(ngModel)]="ville" name="ville" placeholder="Montréal">
            </label>
            <label>
              <span>Code postal</span>
              <input class="input" [(ngModel)]="codePostal" name="codePostal" placeholder="H2J 1A1">
            </label>
          </div>

          <label>
            <span>Téléphone</span>
            <input class="input" [(ngModel)]="telephone" name="telephone" placeholder="514-555-0000">
          </label>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading()">
            <span class="material-symbols-outlined">person_add</span>
            {{ loading() ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>

        <p class="switch">Déjà un compte ? <a routerLink="/login">Connectez-vous</a></p>
      </div>

      <aside class="register-side">
        <h2>Pourquoi rejoindre Loc'Partage ?</h2>
        <ul>
          <li><span class="material-symbols-outlined">verified_user</span> Profils et échanges sécurisés</li>
          <li><span class="material-symbols-outlined">payments</span> Paiement simulé et caution claire</li>
          <li><span class="material-symbols-outlined">eco</span> Économie locale et durable</li>
        </ul>
      </aside>
    </section>
  `,
  styles: [`
    .register-page {
      max-width: 1120px;
      margin: 0 auto;
      padding: var(--space-8) var(--margin-mobile) var(--space-10);
      display: grid;
      gap: var(--space-6);
      align-items: start;
    }

    .register-card,
    .register-side {
      background: #fff;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-premium);
      padding: clamp(24px, 4vw, 42px);
    }

    .register-card h1 {
      color: var(--c-primary);
      font-size: clamp(2.2rem, 5vw, 3.2rem);
      margin: var(--space-4) 0 var(--space-2);
    }

    .register-card > p {
      color: var(--c-text-muted);
      font-size: var(--fs-body-lg);
      margin: 0 0 var(--space-6);
    }

    form {
      display: grid;
      gap: var(--space-4);
    }

    .row {
      display: grid;
      gap: var(--space-4);
    }

    label {
      display: grid;
      gap: var(--space-2);
      color: var(--c-text-main);
      font-weight: 800;
    }

    .switch {
      text-align: center;
      margin: var(--space-5) 0 0;
      color: var(--c-text-muted);
    }

    .register-side {
      background: var(--c-primary);
      color: #fff;
      overflow: hidden;
      position: relative;
    }

    .register-side h2 {
      color: #fff;
      font-size: 1.6rem;
      margin-bottom: var(--space-5);
    }

    .register-side ul {
      display: grid;
      gap: var(--space-4);
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .register-side li {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-weight: 700;
    }

    .register-side span {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: var(--radius-lg);
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
    }

    @media (min-width: 640px) {
      .row { grid-template-columns: 1fr 1fr; }
    }

    @media (min-width: 960px) {
      .register-page {
        grid-template-columns: minmax(0, 1fr) 360px;
        padding-inline: var(--margin-desktop);
      }
      .register-side { position: sticky; top: 104px; }
    }
  `]
})
export class RegisterComponent {
  prenom = '';
  nom = '';
  email = '';
  password = '';
  ville = '';
  codePostal = '';
  telephone = '';
  loading = signal(false);
  err = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading.set(true);
    this.err.set(null);
    this.auth.register({
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      password: this.password,
      ville: this.ville,
      codePostal: this.codePostal,
      telephone: this.telephone
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: e => {
        this.err.set(e?.error?.message || "Erreur lors de l'inscription");
        this.loading.set(false);
      }
    });
  }
}
