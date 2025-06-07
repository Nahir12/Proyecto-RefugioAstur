package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.ImagenDTO;
import com.dwes.ApiRestBackEnd.model.ImagenesCasa;
import com.dwes.ApiRestBackEnd.service.ImagenesCasaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/imagenesCasa")
public class ImagenesCasaController {

    private final ImagenesCasaService imagenesCasaService;

    @Autowired
    public ImagenesCasaController(ImagenesCasaService imagenesCasaService) {
        this.imagenesCasaService = imagenesCasaService;
    }

    @GetMapping("/obtener/{idCasa}")
    public List<ImagenesCasa> obtenerImagenesCasa(@PathVariable Long idCasa) {
        List<ImagenesCasa> imagenes = imagenesCasaService.obtenerImagenesCasa(idCasa);
        if (imagenes == null || imagenes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se han encontrado imágenes.");
        }
        return imagenes;
    }

    @PostMapping("/crearImagenCasa")
    public ImagenesCasa crearImagenCasa(@RequestBody ImagenDTO imagenDTO) {
        return imagenesCasaService.crearImagenCasa(imagenDTO);
    }

    @DeleteMapping("/eliminarImagen/{idImagen}")
    public ResponseEntity<Void> eliminarImagen(@PathVariable Long idImagen) {
        try {
            imagenesCasaService.eliminarImagen(idImagen);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/actualizarImagen/{idImagen}")
    public ResponseEntity<ImagenesCasa> actualizarImagen(@PathVariable Long idImagen, @RequestBody ImagenesCasa imagenConDatos) {
        try {
            ImagenesCasa imagenActualizada = imagenesCasaService.actualizarImagen(idImagen, imagenConDatos);
            return ResponseEntity.ok(imagenActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
