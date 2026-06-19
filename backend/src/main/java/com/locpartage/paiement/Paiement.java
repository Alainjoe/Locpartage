package com.locpartage.paiement;

import com.locpartage.common.BaseEntity;
import com.locpartage.reservation.Reservation;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "paiements")
public class Paiement extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private Reservation reservation;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaiementStatut statut = PaiementStatut.EN_ATTENTE;

    @Column(length = 80)
    private String methode;

    @Column(length = 80)
    private String transactionRef;
}
