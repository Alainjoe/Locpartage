export interface User {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  ville?: string;
  codePostal?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse { token: string; user: User; }

export interface Categorie { id: number; nom: string; icone?: string; description?: string; }

export interface Annonce {
  id: number;
  titre: string;
  description: string;
  prixJour: number;
  caution?: number;
  ville?: string;
  codePostal?: string;
  disponible: boolean;
  categorieId: number;
  categorieNom: string;
  proprietaireId: number;
  proprietaireNom: string;
  photos: string[];
  createdAt: string;
}

export type ReservationStatut = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE';

export interface Reservation {
  id: number;
  annonceId: number;
  annonceTitre: string;
  locataireId: number;
  locataireNom: string;
  dateDebut: string;
  dateFin: string;
  montantTotal: number;
  statut: ReservationStatut;
  messageOptionnel?: string;
  createdAt: string;
}

export interface Message {
  id: number;
  expediteurId: number;
  expediteurNom: string;
  destinataireId: number;
  destinataireNom: string;
  annonceId?: number;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
