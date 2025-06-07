package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.CasaCaracteristicasDTO;
import com.dwes.ApiRestBackEnd.dto.CaracteristicaDTO;
import com.dwes.ApiRestBackEnd.model.CasaCaracteristicas;
import com.dwes.ApiRestBackEnd.model.Casa;
import com.dwes.ApiRestBackEnd.model.Caracteristica;
import com.dwes.ApiRestBackEnd.model.CasaCaracteristicaId;
import com.dwes.ApiRestBackEnd.repository.CasaCaracteristicasRepository;
import com.dwes.ApiRestBackEnd.repository.CasaRepository;
import com.dwes.ApiRestBackEnd.repository.CaracteristicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CasaCaracteristicaService {

    private final CasaCaracteristicasRepository casaCaracteristicasRepository;
    private final CasaRepository casaRepository;
    private final CaracteristicaRepository caracteristicaRepository;

    public CasaCaracteristicaService(CasaCaracteristicasRepository casaCaracteristicasRepository,
                                     CasaRepository casaRepository,
                                     CaracteristicaRepository caracteristicaRepository) {
        this.casaCaracteristicasRepository = casaCaracteristicasRepository;
        this.casaRepository = casaRepository;
        this.caracteristicaRepository = caracteristicaRepository;
    }

    @Transactional
    public CasaCaracteristicasDTO crearCasaCaracteristica(CasaCaracteristicasDTO dto) {

        if (dto.getIdCasa() == null || dto.getIdCasa() <= 0) {
            throw new IllegalArgumentException("El id de la casa es inválido");
        }
        if (dto.getIdCaracteristica() == null || dto.getIdCaracteristica() <= 0) {
            throw new IllegalArgumentException("El id de la característica es inválido");
        }

        Casa casa = casaRepository.findById(dto.getIdCasa()).orElseThrow(() -> new RuntimeException("Casa no encontrada con id: " + dto.getIdCasa()));

        Caracteristica caracteristica = caracteristicaRepository.findById(dto.getIdCaracteristica()).orElseThrow(() -> new RuntimeException("Característica id: " + dto.getIdCaracteristica()+" no encontrada"));

        CasaCaracteristicaId id = new CasaCaracteristicaId(dto.getIdCasa(), dto.getIdCaracteristica());
        if (casaCaracteristicasRepository.existsById(id)) {
            throw new RuntimeException("La  CasaCaracteristica : " + dto.getIdCasa() + " y idCaracteristica: " + dto.getIdCaracteristica()+" ya existe");
        }

        CasaCaracteristicas entity = CasaCaracteristicas.builder()
                .idCasaCaracteristica(id)
                .casa(casa)
                .caracteristica(caracteristica)
                .build();
        CasaCaracteristicas savedEntity = casaCaracteristicasRepository.save(entity);
        return mapToDTO(savedEntity);
    }

    public CasaCaracteristicasDTO mapToDTO(CasaCaracteristicas entity) {
        return CasaCaracteristicasDTO.builder()
                .idCasa(entity.getCasa().getIdCasa())
                .idCaracteristica(entity.getCaracteristica().getIdCaracteristica())
                .build();
    }

    public CaracteristicaDTO mapToCaracteristicaDTO(Caracteristica caracteristica) {
        return CaracteristicaDTO.builder()
                .idCaracteristica(caracteristica.getIdCaracteristica())
                .nombre(caracteristica.getNombre())
                .descripcion(caracteristica.getDescripcion())
                .build();
    }


    @Transactional(readOnly = true)
    public List<CasaCaracteristicasDTO> obtenerCaracteristicas() {
        return casaCaracteristicasRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public void eliminarCasaCaracteristica(CasaCaracteristicasDTO dto) {

        if (dto.getIdCasa() == null || dto.getIdCasa() <= 0) {
            throw new IllegalArgumentException("El id de la casa es inválido");
        }
        if (dto.getIdCaracteristica() == null || dto.getIdCaracteristica() <= 0) {
            throw new IllegalArgumentException("El id de la característica es inválido");
        }
        CasaCaracteristicaId id = new CasaCaracteristicaId(dto.getIdCasa(), dto.getIdCaracteristica());
        if (!casaCaracteristicasRepository.existsById(id)) {
            throw new RuntimeException("La  CasaCaracteristicas no existe para el idCasa: "
                    + dto.getIdCasa() + " y idCaracteristica: " + dto.getIdCaracteristica());
        }
        casaCaracteristicasRepository.deleteById(id);
    }


    @Transactional(readOnly = true)
    public List<CaracteristicaDTO> buscarCaracteristicasDeCasa(Long idCasa) {
        if (idCasa == null || idCasa <= 0) {
            throw new IllegalArgumentException("El id de la casa es inválido");
        }
        // Validar que la Casa exista antes de buscar sus características.
        if (!casaRepository.existsById(idCasa)) {
            throw new RuntimeException("Casa no encontrada con id: " + idCasa);
        }
        List<Caracteristica> caracteristicas = casaCaracteristicasRepository.findCaracteristicasByCasaId(idCasa);
        return caracteristicas.stream()
                .map(this::mapToCaracteristicaDTO)
                .collect(Collectors.toList());
    }
}