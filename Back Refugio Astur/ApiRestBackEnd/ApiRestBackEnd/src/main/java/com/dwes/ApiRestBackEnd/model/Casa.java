package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "casas")
public class Casa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCasa;

    private String nombre;
    private String direccion;
    private String ciudad;
    private Double precio;
    private String descripcion;
    @Column(name = "numBaños", nullable = false)
    private int numBaños;

    @Column(name = "numHabitaciones",  nullable = false)
    private int numHabitaciones;
    @Column(name = "email", nullable = false)
    private String email;

    @OneToMany(mappedBy = "casa")
    @JsonIgnore // hace q los datos de alquiler no salgan infinitamente (serializacion recursva?)
    private List<Alquiler> alquilers;

    @OneToMany(mappedBy = "casa", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ImagenesCasa> imagenesCasa;
}
