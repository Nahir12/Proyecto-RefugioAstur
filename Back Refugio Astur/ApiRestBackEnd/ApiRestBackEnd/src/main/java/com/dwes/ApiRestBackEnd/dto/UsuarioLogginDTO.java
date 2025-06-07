package com.dwes.ApiRestBackEnd.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioLogginDTO {
    @NotBlank(message = "Introduce un email")
    @Email(message = "El email debe ser válido")
    private String email;
    private String contraseña;
    public UsuarioLogginDTO() {}

    public UsuarioLogginDTO(String email, String contraseña) {
        this.email = email;
        this.contraseña = contraseña;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }
}
