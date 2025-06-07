package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.CaracteristicaDTO;
import com.dwes.ApiRestBackEnd.model.Caracteristica;
import com.dwes.ApiRestBackEnd.service.CaracteristicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/", originPatterns = "*")
@RestController
@RequestMapping("/caracteristica")
public class CaracteristicaController {

    private final CaracteristicaService caracteristicaService;

    @Autowired
    public CaracteristicaController(CaracteristicaService caracteristicaService) {
        this.caracteristicaService = caracteristicaService;
    }
    //crear caract
    @PostMapping("/crearCaracteristica")
    public Caracteristica crearCaracteristica(@RequestBody CaracteristicaDTO caracteristica) {
        return caracteristicaService.crearCaracteristica(caracteristica);
    }
    //obtener caract
    @GetMapping("/obtenerCaracteristica")
    public List<CaracteristicaDTO> obtenerCaracteristicas() {
        return caracteristicaService.obtenerCaracteristicas();
    }

    // eliminar característica
    @DeleteMapping("/eliminarCaracteristica/{id}")
    public void eliminarCaracteristica(@PathVariable("id") Long idCaracteristica) {
        caracteristicaService.eliminarCaracteristica(idCaracteristica);
    }
    //Actualizar Características
    @PutMapping("/actualizarCaracteristica/{id}")
    public ResponseEntity<CaracteristicaDTO> updateCaracteristicas(
            @PathVariable Long id,
            @RequestBody CaracteristicaDTO caracteristicaDTO) {
        try {
            CaracteristicaDTO updatedDTO = caracteristicaService.updateCaracteristicas(id, caracteristicaDTO);
            return ResponseEntity.ok(updatedDTO);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }



}
