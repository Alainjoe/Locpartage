package com.locpartage.user;

import com.locpartage.common.NotFoundException;
import com.locpartage.user.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Transactional
    public User register(RegisterRequest req) {
        if (repo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        User u = User.builder()
                .prenom(req.prenom())
                .nom(req.nom())
                .email(req.email())
                .password(encoder.encode(req.password()))
                .telephone(req.telephone())
                .ville(req.ville())
                .codePostal(req.codePostal())
                .role(Role.USER)
                .active(true)
                .build();
        return repo.save(u);
    }

    public User getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
    }

    public User getByEmail(String email) {
        return repo.findByEmail(email).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
    }
}
