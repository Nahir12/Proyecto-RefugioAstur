package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.CasaRequestDTO;
import com.dwes.ApiRestBackEnd.model.Alquiler;
import com.dwes.ApiRestBackEnd.model.Casa;
import com.dwes.ApiRestBackEnd.repository.AlquilerRepository;
import com.dwes.ApiRestBackEnd.repository.CasaCaracteristicasRepository;
import com.dwes.ApiRestBackEnd.repository.CasaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CasaService {


    private final CasaRepository casaRepository;
    private final AlquilerRepository alquilerRepository;
    private final CasaCaracteristicasRepository casaCaracteristicasRepository;

    public CasaService(CasaRepository casaRepository,
                       AlquilerRepository alquilerRepository,
                       CasaCaracteristicasRepository casaCaracteristicasRepository) {
        this.casaRepository = casaRepository;
        this.alquilerRepository = alquilerRepository;
        this.casaCaracteristicasRepository = casaCaracteristicasRepository;
    }

    public CasaRequestDTO mapToRequestDTO(Casa casa) {
        return CasaRequestDTO.builder()
                .idCasa(casa.getIdCasa())
                .nombre(casa.getNombre())
                .direccion(casa.getDireccion())
                .ciudad(casa.getCiudad())
                .precio(casa.getPrecio())
                .descripcion(casa.getDescripcion())
                .numHabitaciones(casa.getNumHabitaciones())
                .numBaños(casa.getNumBaños())
                .email(casa.getEmail())
                .build();
    }

    public Casa mapToEntity(CasaRequestDTO casaDTO) {
        return Casa.builder()
                .nombre(casaDTO.getNombre())
                .direccion(casaDTO.getDireccion())
                .ciudad(casaDTO.getCiudad())
                .precio(casaDTO.getPrecio())
                .descripcion(casaDTO.getDescripcion())
                .numHabitaciones(casaDTO.getNumHabitaciones())
                .numBaños(casaDTO.getNumBaños())
                .email(casaDTO.getEmail())
                .build();
    }

    // Crear  casa
    @Transactional
    public Casa crearCasa(CasaRequestDTO casaDTO) {
        System.out.println("Datos recibidos en crearCasa: " + casaDTO);
        Casa casa = mapToEntity(casaDTO);
        return casaRepository.save(casa);
    }


    // Obtener casas
    @Transactional(readOnly = true)
    public List<CasaRequestDTO> obtenerCasas() {
        return casaRepository.findAll().stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }

    // Eliminar casa
    @Transactional
    public void eliminarCasa(Long idCasa) {
        if (!casaRepository.existsById(idCasa)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe esa casa");
        }
        casaRepository.deleteById(idCasa);
    }

    // Actualizar una casa
    @Transactional
    public CasaRequestDTO updateCasa(Long id, CasaRequestDTO casaDTO) {
        Optional<Casa> optionalCasa = casaRepository.findById(id);
        if (optionalCasa.isPresent()) {
            Casa casaExistente = optionalCasa.get();

            if (casaDTO.getNombre() != null && !casaDTO.getNombre().isEmpty()) {
                casaExistente.setNombre(casaDTO.getNombre());
            }
            if (casaDTO.getDireccion() != null && !casaDTO.getDireccion().isEmpty()) {
                casaExistente.setDireccion(casaDTO.getDireccion());
            }
            if (casaDTO.getCiudad() != null && !casaDTO.getCiudad().isEmpty()) {
                casaExistente.setCiudad(casaDTO.getCiudad());
            }
            if (casaDTO.getPrecio() > 0) {
                casaExistente.setPrecio(casaDTO.getPrecio());
            }
            if (casaDTO.getDescripcion() != null && !casaDTO.getDescripcion().isEmpty()) {
                casaExistente.setDescripcion(casaDTO.getDescripcion());
            }
            if (casaDTO.getNumHabitaciones() > 0) {
                casaExistente.setNumHabitaciones(casaDTO.getNumHabitaciones());
            }
            if (casaDTO.getNumBaños() > 0) {
                casaExistente.setNumBaños(casaDTO.getNumBaños());
            }if(casaDTO.getEmail() != null && !casaDTO.getEmail().isEmpty()){
                casaExistente.setEmail(casaDTO.getEmail());
            }

            Casa updatedCasa = casaRepository.save(casaExistente);
            return mapToRequestDTO(updatedCasa);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Casa no encontrada con ID: " + id);
        }
    }
    @Transactional(readOnly = true)
    public List<Casa> buscarCasasFiltro(String ciudad, Double precio, String caracteristica, Date fechaInicio, Date fechaFin, Long numHabitaciones, Long numBaños) {
        // Obtener todas las casas de la base de datos inicialmente
        List<Casa> casas = casaRepository.findAll();

        // Filtrar por ciudad (solo si se proporciona)
        if (ciudad != null && !ciudad.isEmpty()) {
            casas = casas.stream().filter(casa -> casa.getCiudad().equalsIgnoreCase(ciudad)).collect(Collectors.toList());
        }

        // Filtrar por precio (solo si se proporciona)
        if (precio != null) {
            casas = casas.stream().filter(casa -> casa.getPrecio() <= precio).collect(Collectors.toList());
        }
        //Filtrar por num habitaciones solo si se proporciona)
        if (numHabitaciones != null) {
            casas = casas.stream().filter(casa -> casa.getNumHabitaciones() >= numHabitaciones).collect(Collectors.toList());
        }
        //Filtrar por numBaños (solo si se proporciona)
        if (numBaños != null) {
            casas = casas.stream().filter(casa -> casa.getNumBaños() >= numBaños).collect(Collectors.toList());
        }

        // Filtrar por características (solo si se proporcionan)
        if (caracteristica != null && !caracteristica.isEmpty()){
            String[] caracteristicasArray = caracteristica.split(",");//se pasa un string de cadenas q aqui se separa para compararlo
            List<Long> idsCasasConCaracteristicas = Arrays.stream(caracteristicasArray)
                    .flatMap(caract -> casaCaracteristicasRepository.findByCaracteristicaNombre(caract).stream())
                    .map(casaCaracteristicas -> casaCaracteristicas.getCasa().getIdCasa())
                    .distinct()
                    .collect(Collectors.toList());

            casas = casas.stream().filter(casa -> idsCasasConCaracteristicas.contains(casa.getIdCasa())).collect(Collectors.toList());
        }

        if (fechaInicio != null && fechaFin != null) {//¿se meten las dos?
            List<Alquiler> alquileresDeLaCasa = new ArrayList<>();
            List<Long> idsCasas = new ArrayList<>();//obtengo los alquileres y los id de casa

            // Acumular todos los alquileres de cada  casa
            for (Casa casa : casas) {
                alquileresDeLaCasa.addAll(casa.getAlquilers());
            }

            // Filtrar alquileres según fechas
            for (Alquiler a : alquileresDeLaCasa) {
                if (a.getFechaInicio().equals(fechaFin) ||
                        a.getFechaFin().equals(fechaInicio)||
                        a.getFechaInicio().equals(fechaInicio)||
                        a.getFechaFin().equals(fechaFin)) {//primero comparo que no sean iguales ya de frente
                    idsCasas.add(a.getCasa().getIdCasa());
                }
                //si al hacer lo del repositorio no es nulo (es decir si exite) pues id pal saco
                if (!alquilerRepository.findAlquileresBetweenAndCasa(fechaInicio, a.getCasa().getIdCasa()).isEmpty()
                        || !alquilerRepository.findAlquileresBetweenAndCasa(fechaFin, a.getCasa().getIdCasa()).isEmpty()) {
                    idsCasas.add(a.getCasa().getIdCasa());
                }
            }
            //filtro la lista x si una casa ha salido muchas veces
            List<Long> listaIdsFinal = idsCasas.stream().distinct().collect(Collectors.toList());

            //hago que la otra listas casas elimine las casas encontradas
            casas = casas.stream().filter(casa -> !listaIdsFinal.contains(casa.getIdCasa())).collect(Collectors.toList());
        }

        return casas;
    }
    public List<Casa> obtener3CasasRecienAñadidas() {
        List<Casa> casas = casaRepository.findAll();
        Collections.reverse(casas); // Invierto el orden para sacar las ultimas
        return casas.size() >= 3 ? casas.subList(0, 3) : casas;
    }

    //ObtenerCasaXid
    public Casa getCasaById(Long idCasa) {
        return casaRepository.findById(idCasa).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Casa no encontrada con id: " + idCasa));
    }



}

