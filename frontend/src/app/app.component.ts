import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/header.component';
import { FooterComponent } from './shared/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (!hideHeader()) {
      <app-header></app-header>
    }
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
  `]
})
export class AppComponent {
  hideHeader = signal(false);

  constructor(private router: Router) {
    this.syncRoute(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.syncRoute((event as NavigationEnd).urlAfterRedirects);
    });
  }

  private syncRoute(url: string) {
    this.hideHeader.set(url.startsWith('/login') || url.startsWith('/register'));
  }
}
