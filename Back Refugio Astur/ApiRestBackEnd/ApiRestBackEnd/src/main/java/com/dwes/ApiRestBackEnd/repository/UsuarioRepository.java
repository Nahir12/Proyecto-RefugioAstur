package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    List<Usuario> findAll();
    boolean existsByEmail(String email);

    Optional<Usuario> findByEmail(String email);

}
