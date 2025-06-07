package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "casa_caracteristicas")
public class CasaCaracteristicas {
    @EmbeddedId
    private CasaCaracteristicaId idCasaCaracteristica;

    @ManyToOne
    @JoinColumn(name = "casaId", insertable = false, updatable = false)
    private Casa casa;

    @ManyToOne
    @JoinColumn(name = "caracteristicaId", insertable = false, updatable = false)
    private Caracteristica caracteristica;
}
