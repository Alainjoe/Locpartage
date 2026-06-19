package com.locpartage.reservation;

import com.locpartage.reservation.dto.ReservationDto;

public final class ReservationMapper {
    private ReservationMapper() {}

    public static ReservationDto toDto(Reservation r) {
        return new ReservationDto(
                r.getId(),
                r.getAnnonce().getId(),
                r.getAnnonce().getTitre(),
                r.getLocataire().getId(),
                r.getLocataire().getPrenom() + " " + r.getLocataire().getNom(),
                r.getDateDebut(),
                r.getDateFin(),
                r.getMontantTotal(),
                r.getStatut(),
                r.getMessageOptionnel(),
                r.getCreatedAt()
        );
    }
}
