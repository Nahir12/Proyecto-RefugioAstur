package com.dwes.ApiRestBackEnd.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;

    // Para usuarios registrados, la contraseña es obligatoria y debe tener al menos 6 caracteres.
    // Si se deja en null, se tratará como un usuario temporal.
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contraseña;

}
