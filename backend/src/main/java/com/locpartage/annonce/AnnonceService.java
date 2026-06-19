package com.locpartage.annonce;

import com.locpartage.annonce.dto.AnnonceRequest;
import com.locpartage.categorie.CategorieRepository;
import com.locpartage.common.NotFoundException;
import com.locpartage.user.User;
import com.locpartage.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnnonceService {

    private final AnnonceRepository repo;
    private final CategorieRepository catRepo;
    private final UserRepository userRepo;

    public AnnonceService(AnnonceRepository r, CategorieRepository c, UserRepository u) {
        this.repo = r;
        this.catRepo = c;
        this.userRepo = u;
    }

    public Page<Annonce> search(String q, Long categorieId, String ville, BigDecimal prixMax, Pageable p) {
        String query = q == null ? "" : q.trim();
        String city = ville == null ? "" : ville.trim();
        return repo.search(query, categorieId, city, prixMax, p);
    }

    public Annonce get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Annonce introuvable"));
    }

    public List<Annonce> mine(Long userId) {
        return repo.findByProprietaireId(userId);
    }

    @Transactional
    public Annonce create(AnnonceRequest req, Long userId) {
        User owner = userRepo.findById(userId).orElseThrow();
        Annonce a = Annonce.builder()
                .titre(req.titre())
                .description(req.description())
                .prixJour(req.prixJour())
                .caution(req.caution())
                .ville(req.ville())
                .codePostal(req.codePostal())
                .disponible(true)
                .categorie(catRepo.findById(req.categorieId())
                        .orElseThrow(() -> new NotFoundException("Catégorie introuvable")))
                .proprietaire(owner)
                .photos(req.photos() != null ? new ArrayList<>(req.photos()) : new ArrayList<>())
                .build();
        return repo.save(a);
    }

    @Transactional
    public Annonce update(Long id, AnnonceRequest req, Long userId) {
        Annonce a = get(id);
        if (!a.getProprietaire().getId().equals(userId)) {
            throw new AccessDeniedException("Pas le propriétaire");
        }
        a.setTitre(req.titre());
        a.setDescription(req.description());
        a.setPrixJour(req.prixJour());
        a.setCaution(req.caution());
        a.setVille(req.ville());
        a.setCodePostal(req.codePostal());
        a.setCategorie(catRepo.findById(req.categorieId()).orElseThrow());
        a.setPhotos(req.photos() != null ? new ArrayList<>(req.photos()) : new ArrayList<>());
        return repo.save(a);
    }

    @Transactional
    public void delete(Long id, Long userId, boolean isAdmin) {
        Annonce a = get(id);
        if (!isAdmin && !a.getProprietaire().getId().equals(userId)) {
            throw new AccessDeniedException("Pas le propriétaire");
        }
        repo.delete(a);
    }
}
