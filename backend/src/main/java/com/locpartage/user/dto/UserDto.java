package com.locpartage.user.dto;

import com.locpartage.user.Role;

public record UserDto(
        Long id,
        String prenom,
        String nom,
        String email,
        String telephone,
        String ville,
        String codePostal,
        String avatarUrl,
        Role role
) {}
