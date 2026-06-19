package com.locpartage.annonce;

import com.locpartage.annonce.dto.AnnonceDto;

public final class AnnonceMapper {
    private AnnonceMapper() {}

    public static AnnonceDto toDto(Annonce a) {
        return new AnnonceDto(
                a.getId(),
                a.getTitre(),
                a.getDescription(),
                a.getPrixJour(),
                a.getCaution(),
                a.getVille(),
                a.getCodePostal(),
                a.isDisponible(),
                a.getCategorie() != null ? a.getCategorie().getId() : null,
                a.getCategorie() != null ? a.getCategorie().getNom() : null,
                a.getProprietaire() != null ? a.getProprietaire().getId() : null,
                a.getProprietaire() != null ? a.getProprietaire().getPrenom() + " " + a.getProprietaire().getNom() : null,
                a.getPhotos(),
                a.getCreatedAt()
        );
    }
}
