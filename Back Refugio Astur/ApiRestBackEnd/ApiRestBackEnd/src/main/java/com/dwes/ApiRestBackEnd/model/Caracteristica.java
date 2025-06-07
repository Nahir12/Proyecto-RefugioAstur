package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "caracteristicas")
public class Caracteristica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idCaracteristica;
    private String nombre;
    private String descripcion;

    @OneToMany(mappedBy = "caracteristica")
    private List<CasaCaracteristicas> casaCaracteristicas;
}
