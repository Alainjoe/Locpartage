import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Message } from '../../core/models';

interface Conv {
  otherId: number;
  otherNom: string;
  lastContent: string;
  lastAt: string;
  annonceId?: number;
  unread: boolean;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="messages-page">
      <aside class="conversation-list">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input [ngModel]="search()" (ngModelChange)="search.set($event)" placeholder="Rechercher une discussion">
        </div>

        @for (c of conversations(); track c.otherId) {
          <button class="conversation" type="button" [class.active]="activeConv() === c.otherId" (click)="select(c.otherId)">
            <div class="avatar">{{ initials(c.otherNom) }}</div>
            <div>
              <strong>{{ c.otherNom }}</strong>
              <p>{{ c.lastContent }}</p>
              @if (c.annonceId) { <span>Location #{{ c.annonceId }}</span> }
            </div>
            @if (c.unread) { <em></em> }
          </button>
        } @empty {
          <div class="empty">Aucune conversation.</div>
        }
      </aside>

      <main class="thread">
        @if (activeConv() === null) {
          <div class="thread-empty">
            <span class="material-symbols-outlined">forum</span>
            <h1>Sélectionnez une conversation</h1>
            <p>Vos échanges avec les propriétaires et locataires apparaîtront ici.</p>
          </div>
        } @else {
          <header class="thread-head">
            <button class="back only-mobile" type="button" (click)="activeConv.set(null)">
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h1>{{ currentPeerName() }}</h1>
              <p><span></span> En ligne</p>
            </div>
            <div class="thread-actions">
              <button type="button" aria-label="Appeler"><span class="material-symbols-outlined">call</span></button>
              <button type="button" aria-label="Infos"><span class="material-symbols-outlined">info</span></button>
            </div>
          </header>

          <div class="thread-body">
            <span class="day-chip">Aujourd'hui</span>
            @for (m of thread(); track m.id) {
              <div class="message-row" [class.mine]="m.expediteurId === me()?.id">
                @if (m.expediteurId !== me()?.id) {
                  <div class="avatar mini">{{ initials(m.expediteurNom) }}</div>
                }
                <div class="bubble">
                  <p>{{ m.contenu }}</p>
                  <time>{{ m.createdAt | date:'shortTime' }}</time>
                </div>
              </div>
            } @empty {
              <div class="start-thread">
                <span class="material-symbols-outlined">waving_hand</span>
                <h2>Demarrez la conversation avec {{ currentPeerName() }}</h2>
                <p>Presentez votre demande, vos dates souhaitees ou une question sur l'objet.</p>
              </div>
            }
          </div>

          <form class="composer" (ngSubmit)="send()">
            <button type="button" aria-label="Ajouter une pièce jointe"><span class="material-symbols-outlined">add_circle</span></button>
            <input [(ngModel)]="newMsg" name="newMsg" placeholder="Écrivez votre message...">
            <button class="send" type="submit" [disabled]="!newMsg.trim()" aria-label="Envoyer">
              <span class="material-symbols-outlined">send</span>
            </button>
          </form>
        }
      </main>

      <aside class="rental-context">
        <h2>Contexte de location</h2>
        <article class="context-card">
          <div class="context-image">
            <span class="badge badge-success">Disponible</span>
            <span class="material-symbols-outlined">construction</span>
          </div>
          <div class="context-body">
            <h3>Réservation Loc'Partage</h3>
            <p>Retrouvez les dates, la caution et le lieu de remise directement dans le tableau de bord.</p>
            <ul>
              <li><span class="material-symbols-outlined">calendar_month</span> Samedi, journée complète</li>
              <li><span class="material-symbols-outlined">payments</span> Paiement sécurisé</li>
              <li><span class="material-symbols-outlined">location_on</span> Remise locale</li>
            </ul>
          </div>
        </article>
        <button class="btn btn-secondary btn-block" type="button">Approuver la demande</button>
        <button class="btn btn-ghost btn-block" type="button">Modifier les dates</button>
        <p class="security-note">Le paiement est sécurisé par Loc'Partage. Ne payez jamais en dehors de la plateforme.</p>
      </aside>
    </section>
  `,
  styles: [`
    .messages-page {
      min-height: calc(100vh - 80px);
      display: grid;
      background: #fff;
    }

    .conversation-list,
    .thread,
    .rental-context {
      min-width: 0;
    }

    .conversation-list {
      border-right: 1px solid var(--c-border-subtle);
      background: #fff;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin: var(--space-5);
      padding: 0 16px;
      min-height: 54px;
      border-radius: var(--radius-xl);
      background: var(--c-surface-container-low);
      color: var(--c-text-muted);
    }

    .search-box input {
      flex: 1;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      font: inherit;
    }

    .conversation {
      position: relative;
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-5);
      border: 0;
      border-left: 4px solid transparent;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font: inherit;
    }

    .conversation.active,
    .conversation:hover {
      background: var(--c-primary-fixed);
      border-left-color: var(--c-primary);
    }

    .avatar {
      width: 54px;
      height: 54px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-pill);
      background: var(--c-primary);
      color: #fff;
      font-weight: 900;
    }

    .avatar.mini {
      width: 32px;
      height: 32px;
      font-size: 0.75rem;
      align-self: end;
    }

    .conversation strong {
      display: block;
      color: var(--c-text-main);
      font-size: 1.05rem;
      margin-bottom: var(--space-1);
    }

    .conversation p {
      margin: 0;
      color: var(--c-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .conversation span {
      display: inline-flex;
      margin-top: var(--space-1);
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      background: rgba(0, 45, 112, 0.12);
      color: var(--c-primary);
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .conversation em {
      width: 10px;
      height: 10px;
      border-radius: var(--radius-pill);
      background: var(--c-primary);
      align-self: center;
    }

    .thread {
      display: flex;
      flex-direction: column;
      background: var(--c-background);
    }

    .thread-head {
      min-height: 86px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-5);
      background: #fff;
      border-bottom: 1px solid var(--c-border-subtle);
    }

    .thread-head h1 {
      color: var(--c-text-main);
      font-size: 1.8rem;
      margin: 0;
    }

    .thread-head p {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--c-text-muted);
      margin: var(--space-1) 0 0;
    }

    .thread-head p span {
      width: 10px;
      height: 10px;
      border-radius: var(--radius-pill);
      background: var(--c-status-success);
    }

    .thread-actions {
      display: flex;
      gap: var(--space-2);
    }

    .thread-actions button,
    .back,
    .composer button {
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--c-text-muted);
      cursor: pointer;
    }

    .thread-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
      padding: var(--space-6);
    }

    .day-chip {
      align-self: center;
      padding: 8px 16px;
      border-radius: var(--radius-pill);
      background: var(--c-surface-container);
      color: var(--c-text-muted);
      font-weight: 700;
    }

    .message-row {
      display: flex;
      gap: var(--space-3);
      align-items: end;
    }

    .message-row.mine {
      justify-content: flex-end;
    }

    .bubble {
      max-width: min(620px, 78%);
      padding: var(--space-4) var(--space-5);
      border-radius: var(--radius-2xl);
      background: #fff;
      color: var(--c-text-main);
      border: 1px solid var(--c-border-subtle);
      box-shadow: var(--shadow-sm);
    }

    .message-row.mine .bubble {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }

    .bubble p {
      margin: 0 0 var(--space-2);
      font-size: 1.05rem;
      line-height: 1.55;
    }

    .bubble time {
      display: block;
      text-align: right;
      opacity: 0.72;
      font-size: 0.82rem;
    }

    .composer {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-5);
      background: #fff;
      border-top: 1px solid var(--c-border-subtle);
    }

    .composer input {
      flex: 1;
      min-width: 0;
      height: 56px;
      border: 0;
      outline: 0;
      border-radius: var(--radius-xl);
      background: var(--c-surface-container-low);
      padding: 0 var(--space-5);
      font: inherit;
    }

    .composer .send {
      background: var(--c-primary);
      color: #fff;
      box-shadow: var(--shadow);
    }

    .composer .send:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .thread-empty {
      margin: auto;
      display: grid;
      justify-items: center;
      gap: var(--space-3);
      text-align: center;
      color: var(--c-text-muted);
      padding: var(--space-8);
    }

    .thread-empty > span {
      font-size: 64px;
      color: var(--c-primary);
    }

    .thread-empty h1 {
      color: var(--c-text-main);
      margin: 0;
    }

    .start-thread {
      max-width: 460px;
      margin: auto;
      display: grid;
      justify-items: center;
      gap: var(--space-3);
      padding: var(--space-6);
      text-align: center;
      color: var(--c-text-muted);
    }

    .start-thread > span {
      width: 64px;
      height: 64px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-pill);
      background: var(--c-primary-fixed);
      color: var(--c-primary);
      font-size: 34px;
    }

    .start-thread h2 {
      margin: 0;
      color: var(--c-text-main);
      font-size: 1.35rem;
    }

    .start-thread p {
      margin: 0;
      line-height: 1.6;
    }

    .rental-context {
      display: none;
      padding: var(--space-5);
      border-left: 1px solid var(--c-border-subtle);
      background: #fff;
    }

    .rental-context h2 {
      color: var(--c-text-main);
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: var(--space-4);
    }

    .context-card {
      overflow: hidden;
      border: 1px solid var(--c-border-subtle);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-premium);
      margin-bottom: var(--space-5);
    }

    .context-image {
      position: relative;
      min-height: 210px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #102935, #28495a);
      color: var(--c-secondary-container);
    }

    .context-image > span:last-child {
      font-size: 78px;
    }

    .context-image .badge {
      position: absolute;
      left: 16px;
      top: 16px;
    }

    .context-body {
      padding: var(--space-5);
    }

    .context-body h3 {
      color: var(--c-text-main);
      font-size: 1.45rem;
      margin-bottom: var(--space-2);
    }

    .context-body p,
    .security-note {
      color: var(--c-text-muted);
      line-height: 1.6;
    }

    .context-body ul {
      display: grid;
      gap: var(--space-3);
      margin: var(--space-4) 0 0;
      padding: var(--space-4) 0 0;
      border-top: 1px solid var(--c-border-subtle);
      list-style: none;
    }

    .context-body li {
      display: flex;
      gap: var(--space-3);
      align-items: center;
    }

    .context-body li span {
      color: var(--c-primary);
    }

    .rental-context .btn + .btn {
      margin-top: var(--space-3);
    }

    .security-note {
      margin-top: var(--space-8);
      padding-top: var(--space-5);
      border-top: 1px solid var(--c-border-subtle);
      text-align: center;
    }

    @media (max-width: 779px) {
      .messages-page:has(.thread:not(:empty)) {
        grid-template-columns: 1fr;
      }

      .thread {
        display: none;
      }

      .thread:has(.thread-head) {
        display: flex;
      }

      .messages-page:has(.thread-head) .conversation-list {
        display: none;
      }
    }

    @media (min-width: 780px) {
      .messages-page { grid-template-columns: 340px minmax(0, 1fr); }
      .only-mobile { display: none; }
    }

    @media (min-width: 1180px) {
      .messages-page { grid-template-columns: 360px minmax(0, 1fr) 360px; }
      .rental-context { display: block; }
    }
  `]
})
export class MessagesComponent implements OnInit {
  rawMessages = signal<Message[]>([]);
  activeConv = signal<number | null>(null);
  thread = signal<Message[]>([]);
  newMsg = '';
  search = signal('');
  draftContactName = signal<string | null>(null);
  draftAnnonceId = signal<number | null>(null);

  me = computed(() => this.auth.user());

  conversations = computed<Conv[]>(() => {
    const meId = this.me()?.id;
    if (!meId) return [];
    const map = new Map<number, Conv>();
    const query = this.search().toLowerCase();
    for (const m of this.rawMessages()) {
      const otherId = m.expediteurId === meId ? m.destinataireId : m.expediteurId;
      const otherNom = m.expediteurId === meId ? m.destinataireNom : m.expediteurNom;
      if (query && !otherNom.toLowerCase().includes(query) && !m.contenu.toLowerCase().includes(query)) continue;
      map.set(otherId, {
        otherId,
        otherNom,
        lastContent: m.contenu,
        lastAt: m.createdAt,
        annonceId: m.annonceId,
        unread: !m.lu && m.destinataireId === meId
      });
    }
    const draftId = this.activeConv();
    const draftName = this.draftContactName();
    if (draftId && draftName && !map.has(draftId) && (!query || draftName.toLowerCase().includes(query))) {
      map.set(draftId, {
        otherId: draftId,
        otherNom: draftName,
        lastContent: 'Nouveau message',
        lastAt: '',
        annonceId: this.draftAnnonceId() || undefined,
        unread: false
      });
    }
    return Array.from(map.values());
  });

  constructor(public auth: AuthService, private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.mesMessages().subscribe(m => {
      this.rawMessages.set(m);
      this.openInitialConversation();
    });
  }

  activeConversation(): Conv | undefined {
    return this.conversations().find(c => c.otherId === this.activeConv());
  }

  currentPeerName(): string {
    return this.activeConversation()?.otherNom || this.draftContactName() || 'Conversation';
  }

  initials(name?: string): string {
    return (name || 'LP').split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  select(id: number) {
    this.activeConv.set(id);
    this.loadThread(id);
  }

  loadThread(id: number) {
    this.api.thread(id).subscribe(t => {
      this.thread.set(t);
      const meId = this.me()?.id;
      if (!meId) return;
      this.rawMessages.update(messages => messages.map(m =>
        m.expediteurId === id && m.destinataireId === meId ? { ...m, lu: true } : m
      ));
    });
  }

  send() {
    if (!this.newMsg.trim() || this.activeConv() === null) return;
    const recipientId = this.activeConv()!;
    this.api.envoyerMessage({
      destinataireId: recipientId,
      annonceId: this.activeConversation()?.annonceId || this.draftAnnonceId(),
      contenu: this.newMsg
    }).subscribe(() => {
      this.newMsg = '';
      this.loadThread(recipientId);
      this.api.mesMessages().subscribe(m => this.rawMessages.set(m));
    });
  }

  private openInitialConversation() {
    const to = Number(this.route.snapshot.queryParamMap.get('to'));
    const annonceId = Number(this.route.snapshot.queryParamMap.get('annonceId'));
    const nom = this.route.snapshot.queryParamMap.get('nom');

    if (Number.isFinite(to) && to > 0) {
      this.draftContactName.set(
        nom || this.conversations().find(c => c.otherId === to)?.otherNom || "Membre Loc'Partage"
      );
      this.draftAnnonceId.set(Number.isFinite(annonceId) && annonceId > 0 ? annonceId : null);
      this.select(to);
      return;
    }

    const first = this.conversations()[0];
    if (first) this.select(first.otherId);
  }
}
