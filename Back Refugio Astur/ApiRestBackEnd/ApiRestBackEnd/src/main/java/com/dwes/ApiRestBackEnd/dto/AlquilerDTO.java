package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class AlquilerDTO {
    private Long usuarioID;
    private Long casaID;
    private Date fechaInicio;
    private Date fechaFin;
    private  double precio;
}
