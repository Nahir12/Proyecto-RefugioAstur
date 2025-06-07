package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImagenDTO {
    private Long idImagen;
    private Long idCasa;
    private String urlImagen;
    private String descripcion;
}
