package com.locpartage.user;

import com.locpartage.security.JwtService;
import com.locpartage.user.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepo;
    private final AuthenticationManager authManager;
    private final JwtService jwt;

    public AuthController(UserService u, UserRepository r, AuthenticationManager a, JwtService j) {
        this.userService = u;
        this.userRepo = r;
        this.authManager = a;
        this.jwt = j;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        User u = userService.register(req);
        String token = jwt.generate(u.getId(), u.getEmail(), u.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, UserMapper.toDto(u)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        User u = userRepo.findByEmail(req.email()).orElseThrow();
        String token = jwt.generate(u.getId(), u.getEmail(), u.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, UserMapper.toDto(u)));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@org.springframework.security.core.annotation.AuthenticationPrincipal
                                              com.locpartage.security.AppUserPrincipal p) {
        return ResponseEntity.ok(UserMapper.toDto(p.getUser()));
    }
}
