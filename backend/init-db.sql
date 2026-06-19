-- Init user + database Loc'Partage
-- Exécution : psql -U postgres -f init-db.sql

CREATE USER locpartage WITH PASSWORD 'locpartage';
CREATE DATABASE locpartage OWNER locpartage;
GRANT ALL PRIVILEGES ON DATABASE locpartage TO locpartage;

-- Postgres 15+ : besoin droits sur schema public
\c locpartage
GRANT ALL ON SCHEMA public TO locpartage;
