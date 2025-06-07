package com.dwes.ApiRestBackEnd.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CasaCaracteristicasDTO {

    @NotNull(message = "El ID de la casa no puede ser nulo")
    @Min(value = 1, message = "El ID de la casa debe ser mayor que 0")
    private Long idCasa;

    @NotNull(message = "El ID de la característica no puede ser nulo")
    @Min(value = 1, message = "El ID de la característica debe ser mayor que 0")
    private Long idCaracteristica;
}
