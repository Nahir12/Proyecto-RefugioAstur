package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "imagenes_casa")
public class ImagenesCasa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idImagenes;

    @Column(name = "url_imagen", nullable = false)
    private String url_imagen;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "casaId", nullable = false)
    private Casa casa;
}
