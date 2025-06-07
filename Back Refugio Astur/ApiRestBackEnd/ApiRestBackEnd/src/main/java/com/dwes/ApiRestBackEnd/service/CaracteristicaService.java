package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.CaracteristicaDTO;
import com.dwes.ApiRestBackEnd.model.Caracteristica;
import com.dwes.ApiRestBackEnd.repository.CaracteristicaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CaracteristicaService {
    private final CaracteristicaRepository caracteristicaRepository;

    public CaracteristicaService(CaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }

    public CaracteristicaDTO mapToRequestDTO(Caracteristica caracteristica) {
        return CaracteristicaDTO.builder()
                .idCaracteristica(caracteristica.getIdCaracteristica())
                .nombre(caracteristica.getNombre())
                .descripcion(caracteristica.getDescripcion())
                .build();
    }

    @Transactional
    public Caracteristica crearCaracteristica(CaracteristicaDTO caracteristicaDTO) {
        Caracteristica caracteristica = Caracteristica.builder()
                .nombre(caracteristicaDTO.getNombre())
                .descripcion(caracteristicaDTO.getDescripcion())
                .build();
        return caracteristicaRepository.save(caracteristica);
    }

    @Transactional(readOnly = true)
    public List<CaracteristicaDTO> obtenerCaracteristicas() {
        return caracteristicaRepository.findAll()
                .stream()
                .map(this::mapToRequestDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarCaracteristica(Long idCaracteristica) {
        if (!caracteristicaRepository.existsById(idCaracteristica)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe esa característica");
        }
        caracteristicaRepository.deleteById(idCaracteristica);
    }

    @Transactional
    public CaracteristicaDTO updateCaracteristicas(Long id, CaracteristicaDTO caracteristicaDTO) {

        Optional<Caracteristica> optionalCaracteristica = caracteristicaRepository.findById(id);
        if (optionalCaracteristica.isPresent()) {
            Caracteristica caracteristicaExistente = optionalCaracteristica.get();

            if (caracteristicaDTO.getNombre() != null && !caracteristicaDTO.getNombre().isEmpty()) {
                caracteristicaExistente.setNombre(caracteristicaDTO.getNombre());
            }
            if (caracteristicaDTO.getDescripcion() != null && !caracteristicaDTO.getDescripcion().isEmpty()) {
                caracteristicaExistente.setDescripcion(caracteristicaDTO.getDescripcion());
            }
            Caracteristica updated = caracteristicaRepository.save(caracteristicaExistente);
            return mapToRequestDTO(updated);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Características no encontradas con ID: " + id);
        }
    }
}