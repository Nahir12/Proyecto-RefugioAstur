package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.ImagenesCasa;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ImagenesCasaRepository extends CrudRepository<ImagenesCasa, Long> {
    List<ImagenesCasa> findByCasa_IdCasa(Long idCasa);
}
