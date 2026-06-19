package com.locpartage.annonce;

import com.locpartage.categorie.Categorie;
import com.locpartage.common.BaseEntity;
import com.locpartage.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "annonces")
public class Annonce extends BaseEntity {

    @Column(nullable = false, length = 160)
    private String titre;

    @Column(nullable = false, length = 4000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixJour;

    @Column(precision = 10, scale = 2)
    private BigDecimal caution;

    @Column(length = 120)
    private String ville;

    @Column(length = 20)
    private String codePostal;

    @Column(nullable = false)
    private boolean disponible = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private User proprietaire;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "annonce_photos", joinColumns = @JoinColumn(name = "annonce_id"))
    @Column(name = "url", length = 1000)
    @Builder.Default
    private List<String> photos = new ArrayList<>();
}
