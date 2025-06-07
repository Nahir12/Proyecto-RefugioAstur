package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.CasaCaracteristicasDTO;
import com.dwes.ApiRestBackEnd.dto.CaracteristicaDTO;
import com.dwes.ApiRestBackEnd.service.CasaCaracteristicaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/", originPatterns = "*")
@RestController
@RequestMapping("/casaCaracteristica")
@Validated
public class CasaCaracteristicaController {


    private final CasaCaracteristicaService casaCaracteristicaService;

    @Autowired
    public CasaCaracteristicaController(CasaCaracteristicaService casaCaracteristicaService) {
        this.casaCaracteristicaService = casaCaracteristicaService;
    }

    // Crear CasaCaracteristica
    @PostMapping("/crearCasaCaracteristica")
    public ResponseEntity<CasaCaracteristicasDTO> crearCasaCaracteristica(@RequestBody CasaCaracteristicasDTO dto) {
        try {
            CasaCaracteristicasDTO caracteristica = casaCaracteristicaService.crearCasaCaracteristica(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(caracteristica);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener CasaCaracteristicas
    @GetMapping("/obtenerCaracteristicas")
    public ResponseEntity<List<CasaCaracteristicasDTO>> obtenerCaracteristicas() {
        try {
            List<CasaCaracteristicasDTO> lista = casaCaracteristicaService.obtenerCaracteristicas();
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Eliminar  CasaCaracteristica
    @DeleteMapping("/eliminarCasaCaracteristica")
    public ResponseEntity<Void> eliminarCasaCaracteristica(@RequestBody CasaCaracteristicasDTO dto) {
        try {
            casaCaracteristicaService.eliminarCasaCaracteristica(dto);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Buscar las características completas (CaracteristicaDTO) asociadas a una casa por su ID
    @GetMapping("/buscarCaracteristicasPorCasa/{idCasa}")
    public ResponseEntity<List<CaracteristicaDTO>> buscarCaracteristicasPorCasa(@PathVariable Long idCasa) {
        try {
            List<CaracteristicaDTO> lista = casaCaracteristicaService.buscarCaracteristicasDeCasa(idCasa);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
