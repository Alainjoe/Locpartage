package com.locpartage.user;

import com.locpartage.user.dto.UserDto;

public final class UserMapper {
    private UserMapper() {}

    public static UserDto toDto(User u) {
        return new UserDto(
                u.getId(),
                u.getPrenom(),
                u.getNom(),
                u.getEmail(),
                u.getTelephone(),
                u.getVille(),
                u.getCodePostal(),
                u.getAvatarUrl(),
                u.getRole()
        );
    }
}
