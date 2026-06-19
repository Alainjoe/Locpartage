package com.locpartage.reservation.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ReservationRequest(
        @NotNull Long annonceId,
        @NotNull LocalDate dateDebut,
        @NotNull LocalDate dateFin,
        String messageOptionnel
) {}
