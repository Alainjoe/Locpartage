import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-grid">
        <section class="footer-brand">
          <h2>Loc'Partage</h2>
          <p>La première plateforme québécoise de location entre particuliers dédiée à l'économie circulaire.</p>
          <div class="socials" aria-label="Réseaux sociaux">
            <a href="#" aria-label="Communauté"><span class="material-symbols-outlined">face_nod</span></a>
            <a href="#" aria-label="Partager"><span class="material-symbols-outlined">share</span></a>
          </div>
        </section>

        <section>
          <h3>Plateforme</h3>
          <a routerLink="/">Comment ça marche</a>
          <a href="#">L'assurance Loc'Partage</a>
          <a href="#">Villes desservies</a>
          <a href="#">Tarifs</a>
        </section>

        <section>
          <h3>Support</h3>
          <a href="#">Centre d'aide</a>
          <a href="#">FAQ</a>
          <a href="mailto:contact@locpartage.qc">Contactez-nous</a>
          <a href="#">Signaler un abus</a>
        </section>

        <section>
          <h3>Légal</h3>
          <a href="#">Conditions d'utilisation</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Mentions légales</a>
          <a href="#">Cookies</a>
        </section>
      </div>
      <div class="footer-bottom">
        <small>© 2024 Loc'Partage. Tous droits réservés. Fait au Québec.</small>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--c-surface-container-highest);
      color: var(--c-text-muted);
      border-top: 1px solid var(--c-border-subtle);
    }

    .footer-grid {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 48px var(--margin-mobile);
      display: grid;
      gap: var(--gutter);
    }

    @media (min-width: 760px) {
      .footer-grid {
        grid-template-columns: repeat(4, 1fr);
        padding-inline: var(--margin-desktop);
      }
    }

    h2 {
      color: var(--c-primary);
      font-size: var(--fs-headline-md);
      line-height: var(--lh-headline-md);
      margin-bottom: var(--space-5);
    }

    h3 {
      color: var(--c-primary);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: var(--space-5);
    }

    p {
      max-width: 300px;
      margin: 0 0 var(--space-5);
      font-size: var(--fs-body-sm);
      line-height: var(--lh-body-md);
    }

    a {
      display: block;
      color: var(--c-text-muted);
      margin: 0 0 var(--space-4);
      font-size: var(--fs-body-sm);
      line-height: var(--lh-body-md);
      text-decoration: none;
    }

    a:hover {
      color: var(--c-primary);
      text-decoration: none;
    }

    .socials {
      display: flex;
      gap: var(--space-4);
    }

    .socials a {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      background: #fff;
      border-radius: var(--radius-pill);
      color: var(--c-primary);
      box-shadow: var(--shadow-sm);
      transition: background var(--t-fast), color var(--t-fast);
    }

    .socials a:hover {
      background: var(--c-primary);
      color: #fff;
    }

    .socials span { font-size: 20px; }

    .footer-bottom {
      border-top: 1px solid rgba(116, 119, 130, 0.18);
      text-align: center;
      padding: 32px var(--margin-mobile);
    }
  `]
})
export class FooterComponent {}
