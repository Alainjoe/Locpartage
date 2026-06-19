import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <div class="brand-nav">
          <a routerLink="/" class="brand" (click)="closeMenu()">Loc'Partage</a>

          <nav class="desktop-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Accueil</a>
            <a routerLink="/dashboard" routerLinkActive="active">Réservations</a>
            <a routerLink="/messages" routerLinkActive="active">Messages</a>
            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="active">Admin</a>
            }
          </nav>
        </div>

        @if (showHeaderSearch()) {
          <form class="header-search" (ngSubmit)="goSearch()">
            <span class="material-symbols-outlined">search</span>
            <input [(ngModel)]="q" name="headerQ" placeholder="Rechercher un outil...">
          </form>
        }

        <div class="header-actions">
          <a [routerLink]="auth.isLogged() ? '/annonces/nouvelle' : '/login'" class="publish-btn">
            <span class="material-symbols-outlined">add_circle</span>
            Publier
          </a>
          <button class="avatar-button" type="button" (click)="profileAction()" [title]="auth.isLogged() ? 'Déconnexion' : 'Connexion'">
            @if (auth.user()?.avatarUrl) {
              <img [src]="auth.user()?.avatarUrl" [alt]="auth.user()?.prenom || 'Profil'">
            } @else {
              <img alt="Profil" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxZn9-samQH4TlZO42lPBp6GI1EvfL1N7pFTbWZX0xwKtsUCmE5wu_A6jtX_ar4WDoRVfcWj8DEwmTavbLDvcS9SMLnoVTps-_5o_QVaItLqHpQdqlzfBU2CKAANs_fJ_XirWe4B-J4COpLeC377vpzqPJrBXKuUBItuAOXu3m8epmmp4VgAcosCd-tGiKMCZvvqBoW-ZeYDZVS1WZxfGQY-PXoGoOshtkHbreXr7Dy9WSnDZD-kC6ynndw2-mJyNlVSGjhXCpdNFN">
            }
          </button>
        </div>

        <button class="burger" type="button" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen()" aria-label="Menu">
          <span class="material-symbols-outlined">{{ menuOpen() ? 'close' : 'menu' }}</span>
        </button>
      </div>

      <nav class="mobile-nav" [class.open]="menuOpen()">
        <form class="mobile-search" (ngSubmit)="goSearch()">
          <span class="material-symbols-outlined">search</span>
          <input [(ngModel)]="q" name="mobileQ" placeholder="Rechercher">
        </form>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">Accueil</a>
        <a routerLink="/annonces" routerLinkActive="active" (click)="closeMenu()">Explorer</a>
        <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Réservations</a>
        <a routerLink="/messages" routerLinkActive="active" (click)="closeMenu()">Messages</a>
        <a [routerLink]="auth.isLogged() ? '/annonces/nouvelle' : '/login'" (click)="closeMenu()">Publier</a>
        @if (auth.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active" (click)="closeMenu()">Admin</a>
        }
        @if (auth.isLogged()) {
          <button type="button" class="mobile-logout" (click)="logout()">Déconnexion</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active" (click)="closeMenu()">Connexion</a>
        }
      </nav>
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      height: 80px;
      background: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid var(--c-border-subtle);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: var(--shadow-sm);
    }

    .header-inner {
      max-width: var(--container-max);
      height: 80px;
      margin: 0 auto;
      padding: 0 var(--margin-mobile);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-5);
    }

    .brand-nav {
      display: flex;
      align-items: center;
      gap: 48px;
      min-width: 0;
    }

    .brand {
      color: var(--c-primary);
      font-size: 24px;
      line-height: 1.4;
      font-weight: 700;
      text-decoration: none;
      white-space: nowrap;
    }

    .brand:hover { text-decoration: none; }

    .desktop-nav {
      display: none;
      align-items: center;
      gap: 32px;
      white-space: nowrap;
    }

    .desktop-nav a {
      color: var(--c-text-main);
      font-size: 14px;
      line-height: 1.2;
      letter-spacing: 0.05em;
      font-weight: 600;
      text-decoration: none;
      padding: 30px 0 26px;
      border-bottom: 2px solid transparent;
      transition: color var(--t-fast), border-color var(--t-fast);
    }

    .desktop-nav a:hover,
    .desktop-nav a.active {
      color: var(--c-primary);
      border-bottom-color: var(--c-primary);
      text-decoration: none;
    }

    .header-search,
    .mobile-search {
      align-items: center;
      gap: var(--space-2);
      background: var(--c-surface-container-low);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-pill);
      padding: 0 16px;
      color: var(--c-outline);
    }

    .header-search {
      display: none;
      width: min(384px, 34vw);
      margin-left: auto;
    }

    .header-search input,
    .mobile-search input {
      width: 100%;
      min-width: 0;
      height: 44px;
      border: 0;
      outline: 0;
      background: transparent;
      font: inherit;
      color: var(--c-text-main);
    }

    .header-actions {
      display: none;
      align-items: center;
      gap: 24px;
    }

    .publish-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      min-height: 44px;
      padding: 10px 24px;
      border-radius: 12px;
      background: var(--c-primary);
      color: var(--c-on-primary);
      font-size: 16px;
      font-weight: 500;
      line-height: 1;
      text-decoration: none;
      transition: opacity var(--t-fast), transform var(--t-fast);
    }

    .publish-btn:hover {
      opacity: 0.9;
      text-decoration: none;
    }

    .publish-btn:active { transform: scale(0.95); }
    .publish-btn .material-symbols-outlined { font-size: 20px; }

    .avatar-button {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--c-border-subtle);
      background: var(--c-surface-container);
      overflow: hidden;
      cursor: pointer;
      padding: 0;
      transition: box-shadow var(--t-fast);
    }

    .avatar-button:hover { box-shadow: 0 0 0 2px var(--c-primary); }

    .avatar-button img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .burger {
      margin-left: auto;
      width: 44px;
      height: 44px;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-lg);
      background: #fff;
      color: var(--c-primary);
      cursor: pointer;
    }

    .mobile-nav {
      display: none;
      padding: var(--space-4) var(--margin-mobile) var(--space-5);
      border-top: 1px solid var(--c-border-subtle);
      background: #fff;
      box-shadow: var(--shadow);
    }

    .mobile-nav.open {
      display: grid;
      gap: var(--space-2);
    }

    .mobile-search { display: flex; margin-bottom: var(--space-2); }

    .mobile-nav a,
    .mobile-logout {
      display: flex;
      align-items: center;
      min-height: 44px;
      padding: 0 var(--space-4);
      border-radius: var(--radius-lg);
      color: var(--c-text-main);
      text-decoration: none;
      font: inherit;
      font-weight: 600;
      background: transparent;
      border: 0;
      text-align: left;
      cursor: pointer;
    }

    .mobile-nav a.active,
    .mobile-nav a:hover,
    .mobile-logout:hover {
      background: var(--c-primary-fixed);
      color: var(--c-primary);
      text-decoration: none;
    }

    @media (min-width: 920px) {
      .desktop-nav,
      .header-actions { display: flex; }
      .header-search { display: flex; }
      .burger,
      .mobile-nav { display: none !important; }
    }

    @media (min-width: 1024px) {
      .header-inner { padding: 0 var(--margin-desktop); }
    }
  `]
})
export class HeaderComponent {
  menuOpen = signal(false);
  showHeaderSearch = signal(false);
  q = '';

  constructor(public auth: AuthService, private router: Router) {
    this.syncRoute(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.syncRoute((event as NavigationEnd).urlAfterRedirects);
    });
  }

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }

  goSearch() {
    const q = this.q.trim();
    this.closeMenu();
    this.router.navigate(['/annonces'], { queryParams: q ? { q } : {} });
  }

  profileAction() {
    if (this.auth.isLogged()) {
      this.logout();
      return;
    }
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  private syncRoute(url: string) {
    this.showHeaderSearch.set(url.startsWith('/annonces'));
  }
}
