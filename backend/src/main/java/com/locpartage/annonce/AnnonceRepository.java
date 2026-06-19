package com.locpartage.annonce;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AnnonceRepository extends JpaRepository<Annonce, Long> {

    @EntityGraph(attributePaths = {"categorie", "proprietaire", "photos"})
    List<Annonce> findByProprietaireId(Long proprietaireId);

    @Override
    @EntityGraph(attributePaths = {"categorie", "proprietaire", "photos"})
    Optional<Annonce> findById(Long id);

    @EntityGraph(attributePaths = {"categorie", "proprietaire", "photos"})
    @Query("""
        select a from Annonce a
        where (:q = '' or lower(a.titre) like concat('%', lower(:q), '%') or lower(a.description) like concat('%', lower(:q), '%'))
          and (:categorieId is null or a.categorie.id = :categorieId)
          and (:ville = '' or lower(a.ville) = lower(:ville))
          and (:prixMax is null or a.prixJour <= :prixMax)
          and a.disponible = true
        """)
    Page<Annonce> search(@Param("q") String q,
                          @Param("categorieId") Long categorieId,
                          @Param("ville") String ville,
                          @Param("prixMax") BigDecimal prixMax,
                          Pageable pageable);
}
