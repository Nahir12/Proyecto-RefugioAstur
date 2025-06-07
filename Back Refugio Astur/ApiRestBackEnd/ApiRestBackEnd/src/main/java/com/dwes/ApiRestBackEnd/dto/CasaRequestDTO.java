package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CasaRequestDTO {
    private Long idCasa;
    private String nombre;
    private String direccion;
    private String ciudad;
    private double precio;
    private String descripcion;
    private int numHabitaciones;
    private int numBaños;
    private String email;
}
