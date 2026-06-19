import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="landing-hero">
      <div class="hero-shell">
        <div class="hero-copy">
          <span class="badge badge-eco">Économie Circulaire au Québec</span>
          <h1>Louez du matériel près de chez vous</h1>
          <p>
            Rejoignez une communauté de confiance pour partager vos outils,
            équipements de jardinage et appareils électroniques. Consommez mieux, dépensez moins.
          </p>

          <form class="search-premium" (ngSubmit)="search()">
            <div class="field">
              <span class="material-symbols-outlined">search</span>
              <input [(ngModel)]="q" name="q" placeholder="Que recherchez-vous ?">
            </div>
            <div class="divider"></div>
            <div class="field">
              <span class="material-symbols-outlined">location_on</span>
              <input [(ngModel)]="ville" name="ville" placeholder="Ville ou Code Postal">
            </div>
            <button type="submit">Rechercher</button>
          </form>
        </div>

        <div class="hero-visual">
          @if (heroPhoto()) {
            <img [src]="heroPhoto()" alt="Matériel en location">
          }
          <div class="impact-card">
            <span class="material-symbols-outlined">eco</span>
            <strong>12.4kg de CO2</strong>
            <small>Économisés ce mois-ci</small>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-white">
      <div class="section-head">
        <div>
          <h2>Catégories populaires</h2>
          <p>Explorez les univers de partage les plus actifs.</p>
        </div>
        <a routerLink="/annonces" class="link-more">Voir tout <span class="material-symbols-outlined">arrow_forward</span></a>
      </div>

      <div class="categories-grid">
        @for (c of landingCategories; track c.title) {
          <a class="category-card" [routerLink]="['/annonces']">
            <img [src]="c.image" [alt]="c.title" loading="lazy">
            <div class="label">
              <h3>{{ c.title }}</h3>
              <p>{{ c.count }} articles disponibles</p>
            </div>
          </a>
        }
      </div>
    </section>

    <section class="section recommendations">
      <div class="section-head">
        <div>
          <h2>Recommandations pour vous</h2>
          <p>Des objets utiles, proches et prêts à réserver.</p>
        </div>
        <div class="chips">
          <span class="chip active">Tout</span>
          <span class="chip">À proximité</span>
          <span class="chip">Prix bas</span>
        </div>
      </div>

      <div class="featured-grid">
        @for (card of featuredCards; track card.title) {
          <article class="featured-card">
            <div class="featured-image">
              <img [src]="card.image" [alt]="card.title" loading="lazy">
              <button type="button" aria-label="Ajouter aux favoris">
                <span class="material-symbols-outlined">favorite</span>
              </button>
              <span class="availability" [class.waiting]="card.status !== 'Disponible'">{{ card.status }}</span>
            </div>

            <div class="featured-body">
              <p class="featured-meta">{{ card.category }} • {{ card.city }}</p>
              <a class="featured-title" routerLink="/annonces">{{ card.title }}</a>
              <div class="featured-footer">
                <div class="featured-owner">
                  <img [src]="card.avatar" [alt]="card.owner" loading="lazy">
                  <span>{{ card.owner }}</span>
                </div>
                <p class="featured-price"><strong>{{ card.price }}$</strong><span>/jour</span></p>
              </div>
            </div>
          </article>
        }
      </div>
      <div class="center-action">
        <a routerLink="/annonces" class="btn btn-primary">Parcourir toutes les annonces</a>
      </div>
    </section>

    <section class="section how-section">
      <div class="section-title-center">
        <h2>Comment ça marche ?</h2>
        <p>Une plateforme sécurisée pour louer et prêter en toute sérénité.</p>
      </div>
      <div class="steps">
        @for (step of steps; track step.title) {
          <article class="step-card">
            <span class="material-symbols-outlined">{{ step.icon }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </article>
        }
      </div>
    </section>

    <section class="section trust-section">
      <div class="section-title-center">
        <h2>Ils nous font confiance</h2>
        <div class="stars" aria-label="Note moyenne 5 sur 5">
          <span class="material-symbols-outlined filled">star</span>
          <span class="material-symbols-outlined filled">star</span>
          <span class="material-symbols-outlined filled">star</span>
          <span class="material-symbols-outlined filled">star</span>
          <span class="material-symbols-outlined filled">star</span>
        </div>
        <p>Plus de 5 000 locations réussies au Québec.</p>
      </div>

      <div class="testimonials">
        <blockquote>
          <p>Grâce à Loc'Partage, j'ai pu louer une tondeuse professionnelle pour un week-end. Le propriétaire était charmant et l'outil en parfait état.</p>
          <footer>Jean-Philippe R. <span>Membre depuis 2023</span></footer>
        </blockquote>
        <blockquote>
          <p>Je rentabilise enfin mon outillage qui dormait au garage. La plateforme est intuitive et l'assurance incluse me rassure énormément.</p>
          <footer>Mélanie G. <span>Membre depuis 2022</span></footer>
        </blockquote>
      </div>
    </section>
  `,
  styles: [`
    .landing-hero {
      background:
        radial-gradient(rgba(34, 68, 137, 0.18) 0.7px, transparent 0.7px),
        var(--c-background);
      background-size: 24px 24px;
      padding: 0 var(--margin-mobile);
    }

    .hero-shell,
    .section {
      max-width: var(--container-max);
      margin: 0 auto;
    }

    .hero-shell {
      position: relative;
      isolation: isolate;
      min-height: 870px;
      display: grid;
      align-items: center;
      gap: var(--space-8);
      padding: 64px 0;
    }

    .hero-copy {
      position: relative;
      z-index: 5;
      max-width: 672px;
    }

    .hero-copy .search-premium {
      position: relative;
      z-index: 6;
      max-width: 672px;
    }

    .hero-copy h1 {
      margin: var(--space-5) 0 var(--space-5);
      color: var(--c-primary);
      font-size: var(--fs-display-lg);
      line-height: var(--lh-display-lg);
      font-weight: 700;
    }

    .hero-copy p {
      margin: 0 0 40px;
      color: var(--c-text-muted);
      font-size: var(--fs-body-lg);
      line-height: var(--lh-body-lg);
      max-width: 520px;
    }

    .hero-visual {
      position: relative;
      z-index: 1;
      display: none;
      justify-self: end;
      width: 100%;
      max-width: 608px;
      min-height: 600px;
      border-radius: 32px;
      transform: rotate(2deg);
      background: linear-gradient(140deg, #153f49, #051c2b);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
    }

    .hero-visual img {
      width: 100%;
      height: 100%;
      min-height: 600px;
      object-fit: cover;
      transform: rotate(-2deg) scale(1.08);
      filter: saturate(1.02) contrast(1.02);
    }

    .impact-card {
      position: absolute;
      left: -24px;
      bottom: -24px;
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: var(--space-2);
      align-items: center;
      padding: 24px;
      border-radius: var(--radius-2xl);
      background: rgba(255, 255, 255, 0.92);
      box-shadow: var(--shadow-lg);
      color: var(--c-text-main);
    }

    .impact-card span {
      grid-row: span 2;
      width: 48px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-pill);
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
    }

    .impact-card strong { font-size: 0.95rem; }
    .impact-card small { color: var(--c-text-muted); }

    .section {
      padding: 96px var(--margin-mobile);
    }

    .section-white {
      max-width: none;
      background: #fff;
      padding-inline: max(var(--margin-mobile), calc((100vw - var(--container-max)) / 2 + var(--margin-desktop)));
    }

    .section-head {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: var(--space-5);
      margin-bottom: 48px;
    }

    .section-head h2,
    .section-title-center h2 {
      color: var(--c-primary);
      font-size: var(--fs-headline-lg);
      line-height: var(--lh-headline-lg);
      margin-bottom: var(--space-2);
    }

    .section-head p,
    .section-title-center p {
      margin: 0;
      color: var(--c-text-muted);
    }

    .link-more {
      display: none;
      align-items: center;
      gap: var(--space-1);
      font-weight: 700;
      text-decoration: none;
    }

    .link-more span { font-size: 18px; }

    .cat-fallback {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--c-surface-container);
      color: var(--c-primary);
    }

    .chips {
      display: none;
      gap: var(--space-2);
    }

    .chip {
      padding: 8px 16px;
      border-radius: var(--radius-pill);
      background: #fff;
      color: var(--c-text-muted);
      font-size: 0.85rem;
      border: 1px solid var(--c-border-subtle);
    }

    .chip.active {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }

    .center-action {
      display: flex;
      justify-content: center;
      margin-top: var(--space-8);
    }

    .featured-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--gutter);
    }

    .featured-card {
      overflow: hidden;
      background: var(--c-surface-card);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
      transition: transform var(--t), box-shadow var(--t);
    }

    .featured-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .featured-image {
      position: relative;
      display: block;
      height: 224px;
      overflow: hidden;
      color: inherit;
      text-decoration: none;
    }

    .featured-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 500ms ease;
    }

    .featured-card:hover .featured-image img { transform: scale(1.05); }

    .featured-image button {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.9);
      color: var(--c-primary);
      cursor: pointer;
      backdrop-filter: blur(8px);
    }

    .featured-image button span { font-size: 20px; }

    .availability {
      position: absolute;
      left: 16px;
      bottom: 16px;
      padding: 4px 12px;
      border-radius: var(--radius-pill);
      background: rgba(22, 163, 74, 0.10);
      color: var(--c-status-success);
      font-size: 11px;
      font-weight: 700;
      backdrop-filter: blur(8px);
    }

    .availability.waiting {
      background: rgba(245, 158, 11, 0.10);
      color: var(--c-status-warning);
    }

    .featured-body { padding: 24px; }

    .featured-meta {
      margin: 0 0 8px;
      color: var(--c-text-muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .featured-title {
      display: block;
      overflow: hidden;
      color: var(--c-text-main);
      font-size: 18px;
      font-weight: 700;
      line-height: 1.35;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-decoration: none;
      margin-bottom: 16px;
    }

    .featured-title:hover {
      color: var(--c-primary);
      text-decoration: none;
    }

    .featured-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .featured-owner {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 8px;
      color: var(--c-text-muted);
      font-size: 14px;
    }

    .featured-owner img {
      width: 24px;
      height: 24px;
      flex: 0 0 auto;
      border-radius: var(--radius-pill);
      object-fit: cover;
      border: 1px solid var(--c-border-subtle);
    }

    .featured-owner span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .featured-price {
      display: flex;
      align-items: baseline;
      margin: 0;
      color: var(--c-primary);
      white-space: nowrap;
    }

    .featured-price strong {
      color: var(--c-primary);
      font-size: var(--fs-headline-md);
      line-height: 1;
    }

    .featured-price span {
      color: var(--c-text-muted);
      font-size: 14px;
      margin-left: 2px;
    }

    .how-section {
      max-width: none;
      background: var(--c-surface-container-low);
      padding-inline: max(var(--margin-mobile), calc((100vw - var(--container-max)) / 2 + var(--margin-desktop)));
    }

    .section-title-center {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .steps {
      display: grid;
      gap: var(--space-5);
    }

    .step-card {
      text-align: center;
      padding: var(--space-5);
    }

    .step-card span {
      width: 58px;
      height: 58px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
      border-radius: 16px;
      background: var(--c-primary);
      color: #fff;
      box-shadow: var(--shadow-premium);
    }

    .step-card:nth-child(2) span {
      background: var(--c-secondary-container);
      color: var(--c-on-secondary-container);
    }

    .step-card h3 {
      color: var(--c-text-main);
      font-size: 1.15rem;
      margin-bottom: var(--space-2);
    }

    .step-card p {
      color: var(--c-text-muted);
      margin: 0;
    }

    .stars {
      color: var(--c-status-warning);
      margin-bottom: var(--space-2);
    }

    .testimonials {
      display: grid;
      gap: var(--space-5);
    }

    blockquote {
      margin: 0;
      padding: var(--space-6);
      background: var(--c-surface-card);
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
    }

    blockquote p {
      margin: 0 0 var(--space-4);
      color: var(--c-text-main);
      font-style: italic;
    }

    blockquote footer {
      color: var(--c-primary);
      font-weight: 800;
    }

    blockquote span {
      display: block;
      color: var(--c-text-muted);
      font-size: 0.85rem;
      font-weight: 400;
    }

    @media (min-width: 760px) {
      .landing-hero { padding-inline: var(--margin-desktop); }
      .section { padding-inline: var(--margin-desktop); }
      .steps,
      .testimonials { grid-template-columns: repeat(3, 1fr); }
      .testimonials { grid-template-columns: repeat(2, 1fr); }
      .featured-grid { grid-template-columns: repeat(2, 1fr); }
      .link-more,
      .chips { display: flex; }
    }

    @media (min-width: 1024px) {
      .hero-shell {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        column-gap: 48px;
      }
      .hero-visual { display: block; }
      .featured-grid { grid-template-columns: repeat(4, 1fr); }
    }

    @media (max-width: 759px) {
      .section-head {
        align-items: flex-start;
        flex-direction: column;
      }
      .hero-shell { min-height: auto; padding: var(--space-8) 0; }
      .hero-copy h1 { font-size: var(--fs-display-lg-mobile); line-height: 1.2; }
      .hero-visual { transform: none; }
      .hero-visual img { transform: none; }
    }
  `]
})
export class HomeComponent {
  q = '';
  ville = '';

  steps = [
    { icon: 'search', title: '1. Recherchez', text: 'Trouvez l’objet dont vous avez besoin près de chez vous grâce aux filtres avancés.' },
    { icon: 'event_available', title: '2. Réservez', text: 'Vérifiez les disponibilités et réservez en quelques clics via la plateforme.' },
    { icon: 'handshake', title: '3. Récupérez', text: 'Rencontrez le propriétaire, validez l’état de l’objet et profitez de votre location.' }
  ];

  landingCategories = [
    {
      title: 'Bricolage',
      count: '450+',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDRxxomZjlWsXhWyn0rko2UqZfG7hQbETaCcfKW2rPoxiwzq04lJ7Vu71y0e2XkbSpzd9IgcObnbWhmyzjyNBr2nXXCmAgFhfGvfWSs_PZj5lo_ZTJGik7JuOJblN0ZWNiv1Kci6v1DSLvv6UyDshT6y9r38LQ9RSg0Z6-aIFfHVtDtVw8WERx4B1hbwloUbZAYyHouWFqa5EcLAnPs5MDwyB5zGpmso5zsJsb0pI2LdyvyfTHi6ir7rf-KkNplwUAEZRNbYbM_vo1'
    },
    {
      title: 'Jardinage',
      count: '280+',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLiYTjg0t16VZXwe5wA05vRzF_14tRsJgPG7D53Vxdzz0c9_LyZtfrtc8-bLOORDXZNkck3jcIil_hScx8hxF1HNqcKl6KoYihVtSDZjYGaU-tokMlP-tUTO3jJYPygXQM1tVzmP1eDj27pGRcLuxgjQri9e_Gv7E1Bb6qe516IJXyl6X2LqMuF5pzpmMpv4My8knkVk81m446zqO69CQY8CQQbuU_kdheuBG5YpsLp8RrGvWx5UpUdD2E40cgyNjQbIgzBTInBuE-'
    },
    {
      title: 'Électronique',
      count: '120+',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2HWavojSfOAqeUMFICd7uTlAqmDlhw3glW8o-p6sGDcHiOgW8QL2u4I62kk98nJacrkEn4oax5tbWRpls5BR_h-tEHHot96WnX7ORpubjykghsZA19jC-h_paatGCnATIvvVYD3JGHJGgiuYYNDTAPALnVTin9vaZdwXM3LH2PuAsQRsTuu_VzlQgtxeDaz5KMQixJW73aE3rkYHcjE-uHOLoST4jhejKU1hmSpOQnafyQEjRgAenWM2ju3H3Tflqu3Nowd5SncRW'
    }
  ];

  featuredCards = [
    {
      category: 'Bricolage',
      city: 'Montréal',
      title: 'Perceuse à percussion Pro',
      owner: 'Marc A.',
      price: 15,
      status: 'Disponible',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYCxo8wgzh-WNn1GcJdgmClgeABsHcsOPMIL_SDZy6Pj8GVHYq_aJ-Cbf5lNBi8zI9Mw7N54VIwjvGkhgc3kQDWfFHYvqdKK58tOcfYy4e5tl2_joBSrihTOYV7nknZ0rjNyV5-YfxpBLL8ZZihCSg44pBnsu2PcGb6wFPGn3ycp9PqxdG1ZE_UJi4xzNFt2mJX4Y3Kv5bf7RLu-crfu_vJDLS1fVN_8egBU1m59FNwPbLrPYr_DaU2_AZY6Pkw9UDRtK0hgziDuuX',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjugnEOKvf-RHHXDAORAfttdc_n-nBRAzpTJLRGe5XV3XfVrMhcYvwpSkaQo10R8qMudH8qqcogoWF7gS--VKhbIOA4SH32HROVI6VScQLmsyoT6syoI0HN8rq93hlhF3yFqCRgCTO7O5VDEDSuBHy4vlQDNQg-ACXi34HkGg21dX8CMHbIkq58VFKO5G9If5X42GXKBQTRSeSTDux9coltr1j88y2lswqodRlHEfWu-8Eoa975oESG_fro5xUumilX4_WjjYZaFf5'
    },
    {
      category: 'Électronique',
      city: 'Québec',
      title: 'Vidéoprojecteur 4K Cinéma',
      owner: 'Julie L.',
      price: 25,
      status: 'Disponible',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDmFIVQMLKJrujQHAKdxflq-OU0yvwRmtEbOXWc6yFY58Eieu4tDTQOv3CXvTRT55hZW-2LfSm7gzSCbLblZuahqBARUh0zg4Yy5r_D_BaL7j_bp0DEUtX641cVdO3XGMvtwP-PQXwajHFnwYJeK8-gCap3ce-jZOc-9vMSTasCf1EGDDUt_R2zj7bVIiufZUOUV-YxknPbSnG_5Pg7UbLbzpHFARMJs5Oc-wPVtMLHGmyvqmOXaaM-PnuW9e7jIZnoQ8GEcQcINx1',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF9cHCqx0Q_9CRFVe6Hc5cw6zcItNxVkgT9tq4agbFRaazlMWCEF_bOXDD7_63_7jCUvCB7mF_sc_d2GkqyQz_21ZKWPnZsNOa34ev2JB4pQqXO6rk2dTn8FRLrYTjdUeNHF5mIcw1wKYMWHRJeoVFmeLWwUjgQt98Bwr-E_Y3nzLrTbG-r6Bogcq2u2RWHmCRPnXU4FK7JVvVhXYUuidWJfeoz33OGlBX3aHOrFgj7STxiKutnW3b2ahNg9Zm_Xz7gpulleyd2zF6'
    },
    {
      category: 'Cuisine',
      city: 'Laval',
      title: 'Robot pâtissier KitchenAid',
      owner: 'Thomas D.',
      price: 12,
      status: 'En attente',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsNWMZXTrwylOWVosClmZO3jAg7Bv0JCM1cq0LWEStqi3CZ4PZeXidp9a1i5JUu1rgoY0yKczwPuSUx6a8HTACnl2SGEiRpv9bqSrMGIQck_kde4gkH5yW1Nva9hNodA4g_z8h7Q_k24ZgJWZHUWA_JLdvOEO3Q_yDGifRGi4BUxKgtHEUU4RmaARH1Tq8Zydmp2Us_kKxDZHZtmFjEHfqACWxBVnw-rqLrvMPgmECiutWY8oRK6YkbIDez7_mQK9PzQSvXUbE5xvZ',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkkyYgLt9jL2p0FPt_6u5jrlDLx5qqGA0US4hD1riVlsjeOGgkG_ocr2uesujk5nnbiSlwj5sa3QdSlUEum_QSNwl0ttvRIV5nci8PcOQYaRMnUU7CLxucxQLb4UWnvWPxLYsFMUCpQvSfnTh97jalNf4E0u7pARJSJXLaZlxIaDp1bn4MuW4WBT7mr7JGlHpMwrE8bzk3Qd0Ij9CtNetmX-CR2Hs1bb9PkQIlr3KeMDF6JI2aVFwC-lBtKrxn-5gCijr6eGxxn3l3'
    },
    {
      category: 'Entretien',
      city: 'Longueuil',
      title: 'Nettoyeur vapeur Kärcher',
      owner: 'Sophie B.',
      price: 20,
      status: 'Disponible',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgKGASNt3WwUvPzh8poVo81G3L6rTkJ1GnjzffHWCEnMc6IdzGGWJ_xGu1VVrmUtLcU1V2eZATKQvulNiWkBn76ZpzQeoYflVn9pY_WmOteF2yhBQ7zf5DQViuGbRSlP7KUgECgPjvgCD0yMTrF7RL0q6_I6U2n49QfypW8UtwibXxEsP-mKjTb7_QujjWQree4X3Y2FoFjpjJO2kxAWLrgrA2-P5QjKkpMsX9GOJoPb4U_yquWpt4ygIu_hOBmC0mOj6CjBQiAe80',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRfnV5z7NWG2gCfeTCGnXrDxPecGDpNUTV2SNFGjNzxL0SXyi25NlVNn1U1xv8ldEwuY4dqjZGLtFD9fdyTClTvyiKID7DaSHZe2PRDMBwCNWE2wVxpFX9SCWR3AFsU4en3N21inHinqVkuM9qXbo14ZCPeSW--qlj7ZkA3396uq60_OGF31zWObIXJ143914newD7MvTM0snLTIHXNbBYaU0flFcFLzfLGKiEEFGuQbEKI1NBDBJp5XfUgehGTk5-G2-a6CUSsY-'
    }
  ];

  constructor(private router: Router) {}

  private readonly stitchHeroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeChDcUBengZv4ULsfijfzSAB_QEIPNeZpgbUorCrJrKwwEQtleHxmFHP2ZavNuY6mK5_O8b6rHtDCkZd-qebHkcVUNMV0q95sCxN95Wv1p6p-CTCDTXweaDyMmx4Ka1rxcKltDn5GM6s_xb48_FcV5DL5up9xkmaAUm1QpYV8ESUxLfPS7YXgfMt-vHNr2xjYkyeuyTrUiMzEWzhe2mT_wlwZPHLH6Ds-zPPyldVofZxZj8XmJWuAiK6wTWCuuZ70WZ1RNxvtB4Bj';

  search() {
    this.router.navigate(['/annonces'], { queryParams: { q: this.q || null, ville: this.ville || null } });
  }

  heroPhoto(): string | null {
    return this.stitchHeroImage;
  }
}
