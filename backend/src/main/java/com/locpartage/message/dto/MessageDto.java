package com.locpartage.message.dto;

import java.time.Instant;

public record MessageDto(
        Long id,
        Long expediteurId,
        String expediteurNom,
        Long destinataireId,
        String destinataireNom,
        Long annonceId,
        String contenu,
        boolean lu,
        Instant createdAt
) {}
