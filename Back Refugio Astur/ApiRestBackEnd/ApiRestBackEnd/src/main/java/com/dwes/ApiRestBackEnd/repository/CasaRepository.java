package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Casa;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasaRepository extends JpaRepository<Casa, Long> {
    List<Casa> findAll();


}
