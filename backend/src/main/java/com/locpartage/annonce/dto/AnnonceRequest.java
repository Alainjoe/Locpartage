package com.locpartage.annonce.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public record AnnonceRequest(
        @NotBlank @Size(max = 160) String titre,
        @NotBlank @Size(max = 4000) String description,
        @NotNull @DecimalMin("0.0") BigDecimal prixJour,
        @DecimalMin("0.0") BigDecimal caution,
        String ville,
        String codePostal,
        @NotNull Long categorieId,
        List<String> photos
) {}
