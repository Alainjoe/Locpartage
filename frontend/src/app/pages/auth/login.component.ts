import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-brand">Loc'Partage</div>

      <div class="auth-card">
        <h1>Bon retour parmi nous !</h1>
        <p>Connectez-vous pour continuer vos échanges.</p>

        @if (err()) { <div class="alert alert-error">{{ err() }}</div> }

        <form (ngSubmit)="submit()">
          <label class="auth-field">
            <span>Email</span>
            <div>
              <span class="material-symbols-outlined">mail</span>
              <input type="email" [(ngModel)]="email" name="email" required autocomplete="email" placeholder="nom@exemple.com">
            </div>
          </label>

          <label class="auth-field">
            <span>Mot de passe</span>
            <div>
              <span class="material-symbols-outlined">lock</span>
              <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" required autocomplete="current-password" placeholder="••••••••">
              <button type="button" (click)="togglePassword()" aria-label="Afficher le mot de passe">
                <span class="material-symbols-outlined">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>

          <a class="forgot" href="#">Mot de passe oublié ?</a>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading()">
            {{ loading() ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="divider"><span>Ou continuer avec</span></div>

        <div class="social-grid">
          <button type="button"><span class="material-symbols-outlined">public</span> Google</button>
          <button type="button"><span class="material-symbols-outlined">thumb_up</span> Facebook</button>
        </div>

        <p class="switch">Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: 780px;
      display: grid;
      justify-items: center;
      align-content: start;
      gap: var(--space-6);
      padding: var(--space-8) var(--margin-mobile);
      background: linear-gradient(135deg, #f7f9fb 0%, #e6ecef 100%);
    }

    .auth-brand {
      color: var(--c-primary);
      font-size: 1.8rem;
      font-weight: 900;
    }

    .auth-card {
      width: min(100%, 520px);
      background: #fff;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-lg);
      padding: clamp(24px, 5vw, 48px);
    }

    .auth-card h1 {
      color: var(--c-text-main);
      font-size: clamp(2rem, 5vw, 2.8rem);
      text-align: center;
      margin-bottom: var(--space-2);
    }

    .auth-card > p {
      text-align: center;
      color: var(--c-text-muted);
      margin: 0 0 var(--space-6);
      font-size: var(--fs-body-lg);
    }

    form {
      display: grid;
      gap: var(--space-4);
    }

    .auth-field {
      display: grid;
      gap: var(--space-2);
      color: var(--c-text-main);
      font-weight: 800;
    }

    .auth-field > div {
      min-height: 58px;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: 0 18px;
      border: 1px solid var(--c-outline-variant);
      border-radius: var(--radius-xl);
      background: #fff;
    }

    .auth-field div:focus-within {
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px rgba(0, 45, 112, 0.13);
    }

    .auth-field .material-symbols-outlined {
      color: var(--c-text-muted);
    }

    .auth-field input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      font: inherit;
      color: var(--c-text-main);
    }

    .auth-field button {
      border: 0;
      background: transparent;
      color: var(--c-text-muted);
      cursor: pointer;
      padding: 0;
    }

    .forgot {
      justify-self: end;
      margin-top: -8px;
      font-weight: 700;
      text-decoration: none;
    }

    .divider {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: var(--space-4);
      color: var(--c-text-muted);
      text-transform: uppercase;
      margin: var(--space-6) 0 var(--space-4);
    }

    .divider::before,
    .divider::after {
      content: '';
      height: 1px;
      background: var(--c-border-subtle);
    }

    .social-grid {
      display: grid;
      gap: var(--space-3);
    }

    .social-grid button {
      min-height: 52px;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-lg);
      background: #fff;
      color: var(--c-text-main);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .social-grid button span {
      margin-right: var(--space-2);
      color: var(--c-primary);
    }

    .switch {
      margin: var(--space-6) 0 0;
      text-align: center;
      color: var(--c-text-main);
    }

    .hint {
      margin-top: var(--space-4);
      padding: var(--space-3);
      background: var(--c-primary-fixed);
      border-radius: var(--radius-lg);
      color: var(--c-primary);
      font-size: 0.9rem;
    }

    @media (min-width: 560px) {
      .social-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  err = signal<string | null>(null);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  togglePassword() {
    this.showPassword.update(value => !value);
  }

  submit() {
    this.loading.set(true);
    this.err.set(null);
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/dashboard');
      },
      error: e => {
        this.err.set(e?.error?.message || 'Identifiants invalides');
        this.loading.set(false);
      }
    });
  }
}
