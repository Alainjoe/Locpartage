package com.locpartage.annonce.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record AnnonceDto(
        Long id,
        String titre,
        String description,
        BigDecimal prixJour,
        BigDecimal caution,
        String ville,
        String codePostal,
        boolean disponible,
        Long categorieId,
        String categorieNom,
        Long proprietaireId,
        String proprietaireNom,
        List<String> photos,
        Instant createdAt
) {}
