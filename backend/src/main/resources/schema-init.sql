-- Schéma PostgreSQL Loc'Partage (référence — JPA génère auto en dev avec ddl-auto=update)
-- Utiliser ce script pour init manuelle en prod (ddl-auto=validate).

CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    prenom      VARCHAR(80) NOT NULL,
    nom         VARCHAR(80) NOT NULL,
    email       VARCHAR(160) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    telephone   VARCHAR(30),
    ville       VARCHAR(120),
    code_postal VARCHAR(20),
    avatar_url  VARCHAR(300),
    role        VARCHAR(20) NOT NULL DEFAULT 'USER',
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    nom         VARCHAR(80) NOT NULL UNIQUE,
    icone       VARCHAR(80),
    description VARCHAR(300),
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS annonces (
    id              BIGSERIAL PRIMARY KEY,
    titre           VARCHAR(160) NOT NULL,
    description     VARCHAR(4000) NOT NULL,
    prix_jour       NUMERIC(10,2) NOT NULL,
    caution         NUMERIC(10,2),
    ville           VARCHAR(120),
    code_postal     VARCHAR(20),
    disponible      BOOLEAN NOT NULL DEFAULT TRUE,
    categorie_id    BIGINT NOT NULL REFERENCES categories(id),
    proprietaire_id BIGINT NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_annonces_categorie    ON annonces(categorie_id);
CREATE INDEX IF NOT EXISTS idx_annonces_proprietaire ON annonces(proprietaire_id);
CREATE INDEX IF NOT EXISTS idx_annonces_ville        ON annonces(ville);

CREATE TABLE IF NOT EXISTS annonce_photos (
    annonce_id BIGINT NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
    url        VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS reservations (
    id                BIGSERIAL PRIMARY KEY,
    annonce_id        BIGINT NOT NULL REFERENCES annonces(id),
    locataire_id      BIGINT NOT NULL REFERENCES users(id),
    date_debut        DATE NOT NULL,
    date_fin          DATE NOT NULL,
    montant_total     NUMERIC(10,2) NOT NULL,
    statut            VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    message_optionnel VARCHAR(500),
    created_at        TIMESTAMP,
    updated_at        TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_resa_annonce   ON reservations(annonce_id);
CREATE INDEX IF NOT EXISTS idx_resa_locataire ON reservations(locataire_id);

CREATE TABLE IF NOT EXISTS paiements (
    id              BIGSERIAL PRIMARY KEY,
    reservation_id  BIGINT NOT NULL UNIQUE REFERENCES reservations(id),
    montant         NUMERIC(10,2) NOT NULL,
    statut          VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    methode         VARCHAR(80),
    transaction_ref VARCHAR(80),
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id              BIGSERIAL PRIMARY KEY,
    expediteur_id   BIGINT NOT NULL REFERENCES users(id),
    destinataire_id BIGINT NOT NULL REFERENCES users(id),
    annonce_id      BIGINT REFERENCES annonces(id),
    contenu         VARCHAR(2000) NOT NULL,
    lu              BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_msg_dest ON messages(destinataire_id);
CREATE INDEX IF NOT EXISTS idx_msg_exp  ON messages(expediteur_id);
