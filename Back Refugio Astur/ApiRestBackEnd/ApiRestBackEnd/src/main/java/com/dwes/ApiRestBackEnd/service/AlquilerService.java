package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.AlquilerDTO;
import com.dwes.ApiRestBackEnd.model.Alquiler;
import com.dwes.ApiRestBackEnd.model.Casa;
import com.dwes.ApiRestBackEnd.model.Usuario;
import com.dwes.ApiRestBackEnd.repository.AlquilerRepository;
import com.dwes.ApiRestBackEnd.repository.CasaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class AlquilerService {
    private final AlquilerRepository alquilerRepository;
    private final CasaRepository casaRepository;
    private final CorreoService correoService;
    private final UsuarioService usuarioService;

    @Autowired
    public AlquilerService(AlquilerRepository alquilerRepository,
                           CasaRepository casaRepository,
                           CorreoService correoService,
                           UsuarioService usuarioService) {
        this.alquilerRepository = alquilerRepository;
        this.casaRepository = casaRepository;
        this.correoService = correoService;
        this.usuarioService=usuarioService;
    }

   //saco los dias y los multiplico x el precio
    public double calcularPrecioTotalEstancia(Date fechaInicio, Date fechaFin, long idCasa) {
        if (fechaInicio == null || fechaFin == null) {
            throw new IllegalArgumentException("Las fechas no pueden ser nulas.");
        }
        Casa casa = casaRepository.findById(idCasa).orElseThrow(() -> new RuntimeException("Casa no encontrada con id: " + idCasa));
        long diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
        long dias = TimeUnit.MILLISECONDS.toDays(diferenciaMilisegundos);

        double total = casa.getPrecio() * (dias+1);//eso es así porq entre hoy y hoy hay 0 dias. entre hoy y mañana 2.Pero entre hoy y hoy hay 0 dias y entre hoy y mañana 1,
        return total;
    }

    @Transactional
    public Alquiler crearAlquiler(AlquilerDTO alquilerDTO) {
        Casa casa = casaRepository.findById(alquilerDTO.getCasaID()).orElseThrow(() -> new RuntimeException("Casa no encontrada"));
        Usuario usuario = null;
        if (alquilerDTO.getUsuarioID() != null) {
            usuario = Usuario.builder()
                    .idUsuario(alquilerDTO.getUsuarioID())
                    .build();
        }
        Usuario usuario1= usuarioService.obtenerUsuarioPorId(usuario.getIdUsuario());
        // Se construye el objeto Alquiler a partir del DTO y de la entidad Casa ya que el mapToRequestDTO me falla x algun motivo
        Alquiler alquiler = Alquiler.builder()
                .usuario(usuario)
                .casa(casa)
                .fechaInicio(alquilerDTO.getFechaInicio())
                .fechaFin(alquilerDTO.getFechaFin())
                .precio(alquilerDTO.getPrecio())
                .build();

        // Se crea el alquiler
        Alquiler nuevoAlquiler = alquilerRepository.save(alquiler);

        String emailUsuario = (usuario1 != null) ? usuario1.getEmail() : null;
        String nombreUsuario = (usuario1 != null) ? usuario1.getNombre() : "SIN NOMBRE";
        String emailCasa = casa.getEmail();
        String nombreCasa = casa.getNombre();

        //para pasarlo a español, fecha completa
        String fechaInicioStr ="";
        switch (alquilerDTO.getFechaInicio().getDay()) {
            case 1: fechaInicioStr += "Lunes "; break;
            case 2: fechaInicioStr += "Martes "; break;
            case 3: fechaInicioStr += "Miércoles "; break;
            case 4: fechaInicioStr += "Jueves "; break;
            case 5: fechaInicioStr += "Viernes "; break;
            case 6: fechaInicioStr += "Sábado "; break;
            case 0: fechaInicioStr += "Domingo "; break;
        }

        String fechaFinStr ="";
        switch (alquilerDTO.getFechaFin().getDay()) {
            case 1: fechaFinStr += "Lunes "; break;
            case 2: fechaFinStr += "Martes "; break;
            case 3: fechaFinStr += "Miércoles "; break;
            case 4: fechaFinStr += "Jueves "; break;
            case 5: fechaFinStr += "Viernes "; break;
            case 6: fechaFinStr += "Sábado "; break;
            case 0: fechaFinStr += "Domingo "; break;
        }

        SimpleDateFormat formatoDia = new SimpleDateFormat("dd"); // Solo el día ya q no hay un .get para el como para Year
        String diaInicio = formatoDia.format(alquilerDTO.getFechaInicio());
        String diaFin = formatoDia.format(alquilerDTO.getFechaFin());
        fechaInicioStr+= diaInicio+", del "+alquilerDTO.getFechaInicio().getMonth()+" de "+(alquilerDTO.getFechaInicio().getYear()+ 1900);
         fechaFinStr += diaFin+", del "+ alquilerDTO.getFechaFin().getMonth()+" de "+(alquilerDTO.getFechaFin().getYear() + 1900);
        double precioTotal = alquilerDTO.getPrecio();

        // Enviar correo al usuario
        if (emailUsuario != null) {
            correoService.enviarCorreoReservaUsuario(emailUsuario, nombreUsuario, nombreCasa, fechaInicioStr, fechaFinStr, precioTotal);
        }
        // Enviar correo al dueño de la casa
        if (emailCasa != null) {
            correoService.enviarCorreoReservaCasa(emailCasa, nombreCasa, nombreUsuario, fechaInicioStr, fechaFinStr, precioTotal);
        }
        return nuevoAlquiler;
    }

    @Transactional(readOnly = true)
    public List<Alquiler> obtenerAlquileres() {
        return alquilerRepository.findAll();
    }

    @Transactional
    public void eliminarAlquiler(Long idAlquiler) {
        if (!alquilerRepository.existsById(idAlquiler)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "NO existe ese alquiler");
        }
        alquilerRepository.deleteById(idAlquiler);
    }
    @Transactional(readOnly = true)
    public List<Alquiler> obtenerAlquileresPorUsuario(Long usuarioID) {
        return alquilerRepository.findByUsuario_IdUsuario(usuarioID);
    }

}
