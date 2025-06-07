package com.dwes.ApiRestBackEnd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CaracteristicaDTO {

    private Long idCaracteristica;

    @NotBlank(message = "El nombre de la característica no puede estar vacío")
    private String nombre;

    @NotBlank(message = "La descripción de la característica no puede estar vacía")
    private String descripcion;
}
