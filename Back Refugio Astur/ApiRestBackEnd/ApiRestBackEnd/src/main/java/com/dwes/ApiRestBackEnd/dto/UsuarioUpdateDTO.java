package com.dwes.ApiRestBackEnd.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioUpdateDTO {//Como el UsuarioDTO tiene los @NotBlanck no puedo usarlo para actualizar esto

    private String nombre;
    @Email(message = "El email debe ser válido")
    private String email;
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contraseña;
    private String fotoPerfil;
}
