package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.AlquilerDTO;
import com.dwes.ApiRestBackEnd.model.Alquiler;
import com.dwes.ApiRestBackEnd.service.AlquilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Date;

@CrossOrigin(origins = "http://localhost:5173/", originPatterns = "*")
@RequestMapping("/alquiler")
@RestController
public class AlquilerController {
    private final AlquilerService alquilerService;

    @Autowired
    public AlquilerController(AlquilerService alquilerService) {
        this.alquilerService = alquilerService;
    }

    @PostMapping("/crearAlquiler")
    public Alquiler crearAlquiler(@RequestBody AlquilerDTO alquiler) {
        return alquilerService.crearAlquiler(alquiler);
    }

    @GetMapping("/ObtenerAlquileres")
    public List<Alquiler> obtenerAlquileres() {
        return alquilerService.obtenerAlquileres();
    }

    // Eliminar alquiler
    @DeleteMapping("/eliminarAlquiler/{id}")
    public ResponseEntity<Void> eliminarAlquiler(@PathVariable("id") Long idAlquiler) {
        alquilerService.eliminarAlquiler(idAlquiler);
        return ResponseEntity.noContent().build();
    }

    //  Calcular el precio total de la estancia
    @GetMapping("/sacarTotal/{idCasa}")
    public ResponseEntity<Double> sacarTotal(
            @PathVariable("idCasa") long idCasa,
            @RequestParam("fechaInicio") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
            @RequestParam("fechaFin")   @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin) {
        double total = alquilerService.calcularPrecioTotalEstancia(fechaInicio, fechaFin, idCasa);
        return ResponseEntity.ok(total);
    }
    @GetMapping("/alquilerUsuario/{usuarioID}")
    public ResponseEntity<List<Alquiler>> obtenerAlquileresPorUsuario(@PathVariable Long usuarioID) {
        List<Alquiler> reservas = alquilerService.obtenerAlquileresPorUsuario(usuarioID);
        return ResponseEntity.ok(reservas);
    }


}
