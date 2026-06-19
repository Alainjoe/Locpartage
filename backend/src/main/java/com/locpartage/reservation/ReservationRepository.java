package com.locpartage.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByLocataireIdOrderByCreatedAtDesc(Long locataireId);

    List<Reservation> findByAnnonceProprietaireIdOrderByCreatedAtDesc(Long proprietaireId);

    List<Reservation> findByAnnonceId(Long annonceId);

    @org.springframework.data.jpa.repository.Query("""
        select count(r) > 0 from Reservation r
        where r.annonce.id = :annonceId
          and r.statut in (com.locpartage.reservation.ReservationStatut.EN_ATTENTE,
                           com.locpartage.reservation.ReservationStatut.CONFIRMEE)
          and r.dateDebut <= :fin and r.dateFin >= :debut
        """)
    boolean existsConflit(Long annonceId, LocalDate debut, LocalDate fin);
}
