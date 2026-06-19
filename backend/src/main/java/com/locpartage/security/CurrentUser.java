package com.locpartage.security;

import com.locpartage.user.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public User get() {
        Object p = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (p instanceof AppUserPrincipal aup) return aup.getUser();
        if (p instanceof UserDetails ud) throw new IllegalStateException("Principal not AppUserPrincipal: " + ud.getUsername());
        throw new IllegalStateException("Aucun utilisateur authentifié");
    }

    public Long getId() { return get().getId(); }
}
