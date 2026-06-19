package com.locpartage.reservation;

import com.locpartage.annonce.Annonce;
import com.locpartage.annonce.AnnonceRepository;
import com.locpartage.common.NotFoundException;
import com.locpartage.reservation.dto.ReservationRequest;
import com.locpartage.user.User;
import com.locpartage.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository repo;
    private final AnnonceRepository annonceRepo;
    private final UserRepository userRepo;

    public ReservationService(ReservationRepository r, AnnonceRepository a, UserRepository u) {
        this.repo = r;
        this.annonceRepo = a;
        this.userRepo = u;
    }

    @Transactional
    public Reservation create(ReservationRequest req, Long locataireId) {
        if (req.dateFin().isBefore(req.dateDebut())) {
            throw new IllegalArgumentException("dateFin avant dateDebut");
        }
        Annonce a = annonceRepo.findById(req.annonceId())
                .orElseThrow(() -> new NotFoundException("Annonce introuvable"));
        if (a.getProprietaire().getId().equals(locataireId)) {
            throw new IllegalArgumentException("Impossible de réserver sa propre annonce");
        }
        if (repo.existsConflit(a.getId(), req.dateDebut(), req.dateFin())) {
            throw new IllegalArgumentException("Période déjà réservée");
        }
        long jours = ChronoUnit.DAYS.between(req.dateDebut(), req.dateFin()) + 1;
        BigDecimal montant = a.getPrixJour().multiply(BigDecimal.valueOf(jours));
        User locataire = userRepo.findById(locataireId).orElseThrow();
        Reservation r = Reservation.builder()
                .annonce(a)
                .locataire(locataire)
                .dateDebut(req.dateDebut())
                .dateFin(req.dateFin())
                .montantTotal(montant)
                .statut(ReservationStatut.EN_ATTENTE)
                .messageOptionnel(req.messageOptionnel())
                .build();
        return repo.save(r);
    }

    public List<Reservation> mesReservations(Long userId) {
        return repo.findByLocataireIdOrderByCreatedAtDesc(userId);
    }

    public List<Reservation> recuesParProprietaire(Long ownerId) {
        return repo.findByAnnonceProprietaireIdOrderByCreatedAtDesc(ownerId);
    }

    @Transactional
    public Reservation changerStatut(Long id, ReservationStatut nouveau, Long userId) {
        Reservation r = repo.findById(id).orElseThrow(() -> new NotFoundException("Réservation introuvable"));
        Long owner = r.getAnnonce().getProprietaire().getId();
        Long locataire = r.getLocataire().getId();

        boolean ownerAction = owner.equals(userId) &&
                (nouveau == ReservationStatut.CONFIRMEE || nouveau == ReservationStatut.ANNULEE || nouveau == ReservationStatut.TERMINEE);
        boolean locataireAction = locataire.equals(userId) && nouveau == ReservationStatut.ANNULEE;

        if (!ownerAction && !locataireAction) {
            throw new AccessDeniedException("Action interdite");
        }
        r.setStatut(nouveau);
        return r;
    }
}
