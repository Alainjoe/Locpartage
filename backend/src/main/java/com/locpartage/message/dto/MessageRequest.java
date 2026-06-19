package com.locpartage.message.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MessageRequest(
        @NotNull Long destinataireId,
        Long annonceId,
        @NotBlank @Size(max = 2000) String contenu
) {}
