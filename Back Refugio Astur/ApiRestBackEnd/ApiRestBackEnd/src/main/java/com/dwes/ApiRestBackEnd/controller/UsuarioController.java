package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.UsuarioRegistradoDTO;
import com.dwes.ApiRestBackEnd.dto.UsuarioUpdateDTO;
import com.dwes.ApiRestBackEnd.model.Usuario;
import com.dwes.ApiRestBackEnd.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/", originPatterns = "*")
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/crearUsuario")
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody UsuarioRegistradoDTO usuarioDTO) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crearUsuario(usuarioDTO));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear usuario: " + e.getMessage());
        }
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrarUsuario(@Valid @RequestBody UsuarioRegistradoDTO usuarioDTO) {
        usuarioDTO.setAdmin(false);
        return crearUsuario(usuarioDTO);
    }

    @GetMapping("/obtenerUsuarios")
    public List<Usuario> obtenerUsuarios() {
        try {
            return usuarioService.obtenerListadoUsuarios();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener usuarios.");
        }
    }

    @DeleteMapping("/eliminarUsuario/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable("id") Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok("Usuario eliminado con éxito.");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al eliminar usuario.");
        }
    }

    @PutMapping("/actualizarUsuario/{id}")
    public ResponseEntity<Usuario> modificarUsuario(@PathVariable("id") Long id,
                                                    @Valid @RequestBody UsuarioUpdateDTO usuarioUpdateDTO) {
        try {
            Usuario actualizado = usuarioService.modificarDatosUsuario(id, usuarioUpdateDTO);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al actualizar usuario.");
        }
    }
}
