package com.locpartage.annonce;

import com.locpartage.annonce.dto.AnnonceDto;
import com.locpartage.annonce.dto.AnnonceRequest;
import com.locpartage.security.CurrentUser;
import com.locpartage.user.Role;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/annonces")
public class AnnonceController {

    private final AnnonceService service;
    private final CurrentUser current;

    public AnnonceController(AnnonceService s, CurrentUser c) {
        this.service = s;
        this.current = c;
    }

    @GetMapping
    public Page<AnnonceDto> search(@RequestParam(required = false) String q,
                                   @RequestParam(required = false) Long categorieId,
                                   @RequestParam(required = false) String ville,
                                   @RequestParam(required = false) BigDecimal prixMax,
                                   Pageable pageable) {
        return service.search(q, categorieId, ville, prixMax, pageable).map(AnnonceMapper::toDto);
    }

    @GetMapping("/{id}")
    public AnnonceDto get(@PathVariable Long id) {
        return AnnonceMapper.toDto(service.get(id));
    }

    @GetMapping("/mine")
    public List<AnnonceDto> mine() {
        return service.mine(current.getId()).stream().map(AnnonceMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<AnnonceDto> create(@Valid @RequestBody AnnonceRequest req) {
        return ResponseEntity.ok(AnnonceMapper.toDto(service.create(req, current.getId())));
    }

    @PutMapping("/{id}")
    public AnnonceDto update(@PathVariable Long id, @Valid @RequestBody AnnonceRequest req) {
        return AnnonceMapper.toDto(service.update(id, req, current.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> del(@PathVariable Long id) {
        boolean admin = current.get().getRole() == Role.ADMIN;
        service.delete(id, current.getId(), admin);
        return ResponseEntity.noContent().build();
    }
}
