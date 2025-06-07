package com.dwes.ApiRestBackEnd.repository;
import com.dwes.ApiRestBackEnd.model.Caracteristica;
import com.dwes.ApiRestBackEnd.model.CasaCaracteristicaId;
import com.dwes.ApiRestBackEnd.model.CasaCaracteristicas;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasaCaracteristicasRepository extends JpaRepository<CasaCaracteristicas, CasaCaracteristicaId> {
    public List<CasaCaracteristicas> findAll();
    @Query("SELECT c.caracteristica FROM CasaCaracteristicas c WHERE c.casa.idCasa = :idCasa")
    List<Caracteristica> findCaracteristicasByCasaId(@Param("idCasa") Long idCasa);

    List<CasaCaracteristicas> findByCaracteristicaNombre(String nombreCaracteristica);

}
