package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.ImagenDTO;
import com.dwes.ApiRestBackEnd.model.Casa;
import com.dwes.ApiRestBackEnd.model.ImagenesCasa;
import com.dwes.ApiRestBackEnd.repository.CasaRepository;
import com.dwes.ApiRestBackEnd.repository.ImagenesCasaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ImagenesCasaService {

    private final ImagenesCasaRepository imagenesCasaRepository;
    private final CasaRepository casaRepository;

    @Autowired
    public ImagenesCasaService(ImagenesCasaRepository imagenesCasaRepository, CasaRepository casaRepository) {
        this.imagenesCasaRepository = imagenesCasaRepository;
        this.casaRepository = casaRepository;
    }

    @Transactional(readOnly = true)
    public List<ImagenesCasa> obtenerImagenesCasa(Long idCasa) {
        return imagenesCasaRepository.findByCasa_IdCasa(idCasa);
    }

    // crer imagen
    @Transactional
    public ImagenesCasa crearImagenCasa(ImagenDTO dto) {

        if (dto.getUrlImagen() == null || dto.getUrlImagen().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error: urlImagen no puede ser nula o vacía.");
        }
        Casa casa = casaRepository.findById(dto.getIdCasa()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Casa no encontrada con id: " + dto.getIdCasa()));

        ImagenesCasa imagen = new ImagenesCasa();
        imagen.setIdImagenes(dto.getIdImagen());
        imagen.setCasa(casa);
        imagen.setUrl_imagen(dto.getUrlImagen());
        imagen.setDescripcion(dto.getDescripcion());
        ImagenesCasa imagenGuardada = imagenesCasaRepository.save(imagen);
        return imagenGuardada;
    }

    @Transactional
    public void eliminarImagen(Long idImagen) {
        if (!imagenesCasaRepository.existsById(idImagen)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encuentra la imagen con ID: " + idImagen);
        }
        System.out.println("Eliminando imagen con ID: " + idImagen);
        imagenesCasaRepository.deleteById(idImagen);
    }

    @Transactional
    public ImagenesCasa actualizarImagen(Long idImagen, ImagenesCasa imagen) {


        // Si el valor de idImagen es null (o se convierte a string "undefined" en algún punto), se registrará
        Optional<ImagenesCasa> optionalImagen = imagenesCasaRepository.findById(idImagen);
        if (optionalImagen.isPresent()) {
            ImagenesCasa imagenExistente = optionalImagen.get();
            if (imagen.getUrl_imagen() != null && !imagen.getUrl_imagen().isEmpty()) {
                imagenExistente.setUrl_imagen(imagen.getUrl_imagen());
            }
            if (imagen.getDescripcion() != null && !imagen.getDescripcion().isEmpty()) {
                imagenExistente.setDescripcion(imagen.getDescripcion());
            }
            ImagenesCasa imagenActualizada = imagenesCasaRepository.save(imagenExistente);
            System.out.println("Imagen actualizada con éxito.");
            return imagenActualizada;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encuentra la imagen con ID: " + idImagen);
        }
    }
}
