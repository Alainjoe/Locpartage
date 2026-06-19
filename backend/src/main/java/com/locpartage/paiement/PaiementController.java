package com.locpartage.paiement;

import com.locpartage.common.NotFoundException;
import com.locpartage.reservation.ReservationRepository;
import com.locpartage.reservation.ReservationStatut;
import com.locpartage.security.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final PaiementRepository repo;
    private final ReservationRepository reservRepo;
    private final CurrentUser current;

    public PaiementController(PaiementRepository r, ReservationRepository rr, CurrentUser c) {
        this.repo = r;
        this.reservRepo = rr;
        this.current = c;
    }

    @PostMapping("/simuler/{reservationId}")
    public ResponseEntity<Paiement> simulate(@PathVariable Long reservationId,
                                             @RequestParam(defaultValue = "carte") String methode) {
        var r = reservRepo.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Réservation introuvable"));
        if (!r.getLocataire().getId().equals(current.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Pas votre réservation");
        }
        Paiement p = repo.findByReservationId(reservationId).orElseGet(() ->
                Paiement.builder().reservation(r).montant(r.getMontantTotal()).build());
        p.setMethode(methode);
        p.setStatut(PaiementStatut.REGLE);
        p.setTransactionRef("SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        r.setStatut(ReservationStatut.CONFIRMEE);
        return ResponseEntity.ok(repo.save(p));
    }

    @GetMapping("/reservation/{reservationId}")
    public Paiement byReservation(@PathVariable Long reservationId) {
        return repo.findByReservationId(reservationId)
                .orElseThrow(() -> new NotFoundException("Aucun paiement"));
    }
}
