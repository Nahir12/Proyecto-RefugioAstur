package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Role;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoleRepository  extends CrudRepository<Role, Long> {
    Optional<Role> findByNombre(String nombre);
}
