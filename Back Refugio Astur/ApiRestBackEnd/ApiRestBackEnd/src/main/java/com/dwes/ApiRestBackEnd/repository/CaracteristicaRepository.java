package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaracteristicaRepository extends JpaRepository<Caracteristica,Long> {
    List<Caracteristica> findAll();

}
