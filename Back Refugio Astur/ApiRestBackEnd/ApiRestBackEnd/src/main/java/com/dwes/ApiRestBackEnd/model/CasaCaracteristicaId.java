package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CasaCaracteristicaId implements Serializable {
    private Long casaId;
    private Long caracteristicaId;
}
