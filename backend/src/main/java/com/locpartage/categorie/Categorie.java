package com.locpartage.categorie;

import com.locpartage.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "categories")
public class Categorie extends BaseEntity {

    @Column(nullable = false, unique = true, length = 80)
    private String nom;

    @Column(length = 1000)
    private String icone;

    @Column(length = 300)
    private String description;
}
