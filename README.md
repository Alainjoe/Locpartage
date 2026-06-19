# Loc'Partage

Plateforme de **location de matériel entre particuliers** (Québec).
Cahier des charges : `Cahier_des_Charges_LocPartage.docx`.

> Responsive **mobile-first** : utilisable sur téléphone, tablette, desktop.

## Architecture

```
maquette/
├── backend/    # Spring Boot 3.3 + JPA + Spring Security (JWT)
└── frontend/   # Angular 18 (standalone, signals, lazy-loaded routes)
```

## Stack

| Couche      | Techno                                          |
|-------------|-------------------------------------------------|
| Backend     | Java 21 · Spring Boot 3.3 · Spring Data JPA     |
| Sécurité    | Spring Security · JWT (jjwt 0.12)               |
| BDD         | PostgreSQL 16 (dev + prod)                      |
| Frontend    | Angular 18 · TypeScript · SCSS · Signals        |
| Responsive  | CSS Grid + Flexbox + media queries mobile-first |

## Domaine

- **User** (Utilisateur) — propriétaire OU locataire
- **Categorie** — Bricolage, Sport, Jardinage, Camping, …
- **Annonce** — matériel à louer (titre, prix/jour, caution, photos, ville)
- **Reservation** — cycle EN_ATTENTE → CONFIRMEE → TERMINEE / ANNULEE
- **Paiement** — simulation REGLE / EN_ATTENTE / ECHEC / REMBOURSE
- **Message** — messagerie interne propriétaire ↔ locataire

## Lancer le projet

### Prérequis

- **Java 21+** (OK : Java 23 détecté)
- **Maven 3.9+** : `winget install Apache.Maven` ou `choco install maven`
- **Node 18+ & npm** (OK : Node 24 / npm 11 détectés)
- **PostgreSQL 16** (Docker recommandé)

### 1. Base PostgreSQL (Docker)

```bash
docker compose up -d postgres
```

Démarre Postgres sur `localhost:5432`, DB `locpartage`, user/mdp `locpartage`/`locpartage`.

Sans Docker → install Postgres manuel puis :
```sql
CREATE DATABASE locpartage;
CREATE USER locpartage WITH PASSWORD 'locpartage';
GRANT ALL PRIVILEGES ON DATABASE locpartage TO locpartage;
```

### 2. Backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

JPA `ddl-auto=update` crée les tables auto au 1er run (dev).
Prod → `ddl-auto=validate`, init via `src/main/resources/schema-init.sql`.

Build JAR : `mvn clean package`

Profil `dev` par défaut → base H2 fichier `data/locpartage.mv.db`.
Console H2 : http://localhost:8080/h2-console (`jdbc:h2:file:./data/locpartage`, user `sa`).

**Comptes seedés** :
| Email                 | Mot de passe | Rôle  |
|-----------------------|--------------|-------|
| `admin@locpartage.qc` | `admin1234`  | ADMIN |
| `demo@locpartage.qc`  | `demo1234`   | USER  |

### 3. Frontend (port 4200)

```bash
cd frontend
npm install
npm start
```

Proxy intégré → `/api/*` redirigé vers `http://localhost:8080`.
Ouvrir http://localhost:4200.

## Endpoints REST principaux

| Méthode | URL                                      | Auth | Description                  |
|---------|------------------------------------------|------|------------------------------|
| POST    | `/api/auth/register`                     | —    | Inscription                  |
| POST    | `/api/auth/login`                        | —    | Connexion (retourne JWT)     |
| GET     | `/api/auth/me`                           | ✓    | Profil courant               |
| GET     | `/api/categories`                        | —    | Catégories                   |
| GET     | `/api/annonces?q=&categorieId=&ville=&prixMax=` | — | Recherche paginée       |
| GET     | `/api/annonces/{id}`                     | —    | Détail                       |
| GET     | `/api/annonces/mine`                     | ✓    | Mes annonces                 |
| POST    | `/api/annonces`                          | ✓    | Créer                        |
| PUT     | `/api/annonces/{id}`                     | ✓    | Modifier (propriétaire)      |
| DELETE  | `/api/annonces/{id}`                     | ✓    | Supprimer                    |
| POST    | `/api/reservations`                      | ✓    | Réserver                     |
| GET     | `/api/reservations/mine`                 | ✓    | Mes réservations             |
| GET     | `/api/reservations/received`             | ✓    | Reçues (propriétaire)        |
| PATCH   | `/api/reservations/{id}/statut?value=…`  | ✓    | Confirmer / annuler / terminer |
| POST    | `/api/messages`                          | ✓    | Envoyer message              |
| GET     | `/api/messages`                          | ✓    | Mes conversations            |
| GET     | `/api/messages/thread/{otherUserId}`     | ✓    | Fil de discussion            |
| POST    | `/api/paiements/simuler/{reservationId}` | ✓    | Paiement simulé              |

## Responsive

Le frontend utilise une approche **mobile-first** :

| Breakpoint | Cible        | Comportement                              |
|------------|--------------|-------------------------------------------|
| `< 600px`  | Mobile       | Header burger, grille 1 col, filtres empilés |
| `600-900`  | Tablette     | Grille 2 cols, filtres en ligne, hero étendu |
| `900-1024` | Tablette XL  | Header inline, 2 cols détail annonce      |
| `≥ 1024px` | Desktop      | Grille 3-4 cols, layouts larges           |

Composants clés :
- **Header** : burger mobile, inline desktop (`<app-header>`)
- **Grille annonces** : `repeat(auto-fit)` 1→2→3→4 colonnes
- **Filtres** : empilés mobile, en ligne ≥600px
- **Messagerie** : split view tablette/desktop, vue empilée mobile

## Production

Backend : profil `prod` + PostgreSQL
```bash
DB_URL=jdbc:postgresql://host:5432/locpartage \
DB_USER=… DB_PASSWORD=… JWT_SECRET=… \
java -jar target/locpartage-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```
Init schéma : `psql -U … -d locpartage -f backend/src/main/resources/schema-init.sql`

Frontend :
```bash
npm run build      # dist/locpartage
```
Servir `dist/locpartage/browser` derrière nginx/Apache, reverse-proxy `/api → :8080`.
