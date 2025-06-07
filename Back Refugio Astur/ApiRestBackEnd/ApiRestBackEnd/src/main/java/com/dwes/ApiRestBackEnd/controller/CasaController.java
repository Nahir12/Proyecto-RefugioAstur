package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.CasaRequestDTO;
import com.dwes.ApiRestBackEnd.model.Casa;
import com.dwes.ApiRestBackEnd.service.CasaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/", originPatterns = "*")
@RestController
@RequestMapping("/casa")
public class CasaController {

    private final CasaService casaService;

    @Autowired
    public CasaController(CasaService casaService) {
        this.casaService = casaService;
    }

    // crear una casa
    @PostMapping("/crearCasa")
    public Casa crearCasa(@RequestBody CasaRequestDTO casaDTO) {
        return casaService.crearCasa(casaDTO);
    }

    // Obtener listado de casas
    @GetMapping("/obtenerCasas")
    public List<CasaRequestDTO> obtenerCasas() {
        return casaService.obtenerCasas();
    }

    // eliminar  casa
    @DeleteMapping("/eliminarCasa/{id}")
    public void eliminarCasa(@PathVariable("id") Long idCasa) {
        casaService.eliminarCasa(idCasa);
    }

    // actualizar una casa
    @PutMapping("/actualizarCasa/{id}")
    public ResponseEntity<CasaRequestDTO> updateCasa(
            @PathVariable Long id,
            @RequestBody CasaRequestDTO casaDTO) {
        try {
            CasaRequestDTO updatedCasa = casaService.updateCasa(id, casaDTO);
            return ResponseEntity.ok(updatedCasa);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }


    @GetMapping("/recientes")
    public List<Casa> obtenerUltimasCasas() {
        return casaService.obtener3CasasRecienAñadidas();
    }

    @GetMapping("/buscarCasasFiltro")
    public List<Casa> buscarCasas(
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) Double precio,
            @RequestParam(required = false) String caracteristica,
            @RequestParam(required = true) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
            @RequestParam(required = true) @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin,
            @RequestParam(required = false, defaultValue = "1") long numBaños,
            @RequestParam(required = false, defaultValue = "1") Long numHabitaciones) {

        return casaService.buscarCasasFiltro(ciudad, precio, caracteristica, fechaInicio, fechaFin, numHabitaciones, numBaños);
    }
    @GetMapping("/obtenerCasa/{idCasa}")
    public Casa getCasaById(@PathVariable Long idCasa) {
        return casaService.getCasaById(idCasa);
    }
}

