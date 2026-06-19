package com.locpartage.reservation;

import com.locpartage.reservation.dto.ReservationDto;
import com.locpartage.reservation.dto.ReservationRequest;
import com.locpartage.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;
    private final CurrentUser current;

    public ReservationController(ReservationService s, CurrentUser c) {
        this.service = s;
        this.current = c;
    }

    @PostMapping
    public ResponseEntity<ReservationDto> create(@Valid @RequestBody ReservationRequest req) {
        return ResponseEntity.ok(ReservationMapper.toDto(service.create(req, current.getId())));
    }

    @GetMapping("/mine")
    public List<ReservationDto> mine() {
        return service.mesReservations(current.getId()).stream().map(ReservationMapper::toDto).toList();
    }

    @GetMapping("/received")
    public List<ReservationDto> received() {
        return service.recuesParProprietaire(current.getId()).stream().map(ReservationMapper::toDto).toList();
    }

    @PatchMapping("/{id}/statut")
    public ReservationDto statut(@PathVariable Long id, @RequestParam ReservationStatut value) {
        return ReservationMapper.toDto(service.changerStatut(id, value, current.getId()));
    }
}
