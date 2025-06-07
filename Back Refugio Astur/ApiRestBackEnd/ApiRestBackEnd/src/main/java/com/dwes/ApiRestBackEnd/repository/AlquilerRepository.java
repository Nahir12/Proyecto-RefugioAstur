package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
@Repository
public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {

    List<Alquiler> findAll();

    @Query("SELECT a FROM Alquiler a WHERE :fechaIntroducida BETWEEN a.fechaInicio AND a.fechaFin " +
            "AND a.casa.idCasa = :idCasa")
    List<Alquiler> findAlquileresBetweenAndCasa(@Param("fechaIntroducida") Date fechaIntroducida, @Param("idCasa") Long idCasa);

    List<Alquiler> findByUsuario_IdUsuario(Long usuarioID);
}
