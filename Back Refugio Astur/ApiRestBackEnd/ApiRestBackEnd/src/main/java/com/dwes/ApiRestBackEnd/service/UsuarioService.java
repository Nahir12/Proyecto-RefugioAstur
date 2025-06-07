package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.UsuarioRegistradoDTO;
import com.dwes.ApiRestBackEnd.dto.UsuarioUpdateDTO;
import com.dwes.ApiRestBackEnd.model.Alquiler;
import com.dwes.ApiRestBackEnd.model.Role;
import com.dwes.ApiRestBackEnd.model.Usuario;
import com.dwes.ApiRestBackEnd.repository.RoleRepository;
import com.dwes.ApiRestBackEnd.repository.UsuarioRepository;
import com.dwes.ApiRestBackEnd.repository.AlquilerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final AlquilerRepository alquilerRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, RoleRepository roleRepository,
                          AlquilerRepository alquilerRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.alquilerRepository = alquilerRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }


    // crear usuarip
    @Transactional
    public Usuario crearUsuario(UsuarioRegistradoDTO usuarioDTO) {
        Optional<Role> optionalRole = roleRepository.findByNombre("ROLE_USER");
        List<Role> roles = new ArrayList<>();
        optionalRole.ifPresent(roles::add);

        // si se quiere q sea admin
        if (usuarioDTO.isAdmin()) {
            Optional<Role> optionalRoleAdmin = roleRepository.findByNombre("ROLE_ADMIN");
            optionalRoleAdmin.ifPresent(roles::add);
        }

        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        // Si se recibe contraseña no es temporal
        if (usuarioDTO.getContraseña() != null && usuarioDTO.getContraseña().trim().length() >= 6) {
            usuarioDTO.setEsTemporal(false);
            // Codifica la contraseña antes de asignarla
            usuarioDTO.setContraseña(passwordEncoder.encode(usuarioDTO.getContraseña()));
        } else {
            // Se crea el usuario como temporal y se ignora la contraseña
            usuarioDTO.setEsTemporal(true);
            usuarioDTO.setContraseña(null);
        }

        Usuario usuario = Usuario.builder()
                .nombre(usuarioDTO.getNombre())
                .email(usuarioDTO.getEmail())
                .contraseña(usuarioDTO.getContraseña())
                .esTemporal(usuarioDTO.isEsTemporal())
                .roles(roles)
                .build();

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerListadoUsuarios() {
        return usuarioRepository.findAll();
    }

    //eliminar usuario
    @Transactional
    public void eliminarUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new IllegalArgumentException("No se encontró el usuario con id: " + idUsuario));

        if (usuario.getAlquilers() != null && !usuario.getAlquilers().isEmpty()) {
            for (Object a : usuario.getAlquilers()) {
                alquilerRepository.delete((Alquiler) a);
            }
        }
        usuarioRepository.delete(usuario);
    }

    @Transactional
    public Usuario modificarDatosUsuario(Long id, UsuarioUpdateDTO usuarioUpdateDTO) {
        // Buscamos el usuario por id
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("No se encontró el usuario con id: " + id));

        // Solo permitimos modificar usuarios registrados.
        if (usuario.getEsTemporal() != null && usuario.getEsTemporal()) {
            throw new IllegalArgumentException("No se pueden modificar datos de un usuario temporal");
        }

        // Actualizar nombre si se envía
        if (usuarioUpdateDTO.getNombre() != null && !usuarioUpdateDTO.getNombre().isBlank()) {
            usuario.setNombre(usuarioUpdateDTO.getNombre());
        }

        // Actualizar email si se envía, verificando duplicidad
        if (usuarioUpdateDTO.getEmail() != null && !usuarioUpdateDTO.getEmail().isBlank()) {
            if (!usuario.getEmail().equalsIgnoreCase(usuarioUpdateDTO.getEmail()) &&
                    usuarioRepository.existsByEmail(usuarioUpdateDTO.getEmail())) {
                throw new IllegalArgumentException("El email proporcionado ya está en uso");
            }
            usuario.setEmail(usuarioUpdateDTO.getEmail());
        }

        // Actualizar contraseña si se envía, si no, se conserva la actual.
        if (usuarioUpdateDTO.getContraseña() != null && !usuarioUpdateDTO.getContraseña().isBlank()) {
            usuario.setContraseña(usuarioUpdateDTO.getContraseña());
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario obtenerUsuarioPorId(Long usuarioID) {
        return usuarioRepository.findById(usuarioID)
                .orElseThrow(() -> new RuntimeException("Usuario con ID " + usuarioID + " no encontrado."));
    }
}
