package com.locpartage.reservation.dto;

import com.locpartage.reservation.ReservationStatut;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ReservationDto(
        Long id,
        Long annonceId,
        String annonceTitre,
        Long locataireId,
        String locataireNom,
        LocalDate dateDebut,
        LocalDate dateFin,
        BigDecimal montantTotal,
        ReservationStatut statut,
        String messageOptionnel,
        Instant createdAt
) {}
