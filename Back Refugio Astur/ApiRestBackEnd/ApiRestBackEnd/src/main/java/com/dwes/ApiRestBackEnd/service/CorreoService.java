package com.dwes.ApiRestBackEnd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CorreoService {

    private final JavaMailSender mailSender;

    // Creamos un logger para diagnosticar el flujo
    private static final Logger logger = LoggerFactory.getLogger(CorreoService.class);

    @Value("${spring.mail.username}")
    private String emailRemitente;

    @Autowired
    public CorreoService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //correo al usuario
    public void enviarCorreoReservaUsuario(String destinatario, String nombreUsuario, String nombreCasa,
                                           String fechaInicio, String fechaFin, double precioTotal) {
        logger.info("Iniciando envío de correo para reserva de usuario.");
        logger.info("Datos recibidos: destinatario: {}, nombreUsuario: {}, nombreCasa: {}, fechaInicio: {}, fechaFin: {}, precioTotal: {}",
                destinatario, nombreUsuario, nombreCasa, fechaInicio, fechaFin, precioTotal);
//como falla pues pa ver onde

        // Verificación de null para nombreUsuario
        if (nombreUsuario == null) {
            logger.warn("El valor de nombreUsuario es null. Se asignará un valor por defecto.");
            nombreUsuario = "Un anónimo ";
        }

        String asunto = "Confirmación de tu reserva";
        String mensaje = "Hola " + nombreUsuario + ",\n\n" +
                "Tu reserva para la casa \"" + nombreCasa + "\" ha sido confirmada.\n" +
                "Fecha de inicio: " + fechaInicio + "\n" +
                "Fecha de fin: " + fechaFin + "\n" +
                "Importe final de la transacción: " + String.format("%.2f", precioTotal) + "€\n\n" +
                "Gracias por confiar en Refugio Astur para hacer su reserva. ¡Disfruta de tu estancia!";

        // Log antes de enviar
        enviarCorreo(new String[]{destinatario}, asunto, mensaje, "usuario");
    }

    //correo propietario
    public void enviarCorreoReservaCasa(String destinatario, String nombreCasa, String nombreUsuario,
                                        String fechaInicio, String fechaFin, double precioTotal) {
        logger.info("Datos recibidos: destinatario: {}, nombreCasa: {}, nombreUsuario: {}, fechaInicio: {}, fechaFin: {}, precioTotal: {}",
                destinatario, nombreCasa, nombreUsuario, fechaInicio, fechaFin, precioTotal);

        // como antes
        if (nombreUsuario == null) {
            logger.warn("El valor de nombreUsuario es null en el correo para casa. Se asignará un valor por defecto.");
            nombreUsuario = "Usuario";
        }

        String asunto = "Tu propiedad ha sido reservada";
        String mensaje = "Hola propietario,\n\n" +
                "La casa \"" + nombreCasa + "\" ha sido reservada por " + nombreUsuario + ".\n" +
                "Fecha de inicio: " + fechaInicio + "\n" +
                "Fecha de fin: " + fechaFin + "\n" +
                "Precio total: " + String.format("%.2f", precioTotal) + "€\n\n" +
                "¡Recuerde tenerlo todo listo para su ingreso! ";

        // Envío del correo
        enviarCorreo(new String[]{destinatario}, asunto, mensaje, "propietario");
    }

    //Método central para enviar el correo. Se usa tanto para el consumidor como para el propietario.

    private void enviarCorreo(String[] destinatarios, String asunto, String mensaje, String tipoCorreo) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(emailRemitente);
        mailMessage.setTo(destinatarios);
        mailMessage.setSubject(asunto);
        mailMessage.setText(mensaje);

        logger.info("Intentando enviar correo tipo '{}' desde {} a {}.",
                tipoCorreo, emailRemitente, String.join(", ", destinatarios));
        try {
            mailSender.send(mailMessage);
            logger.info("Correo tipo '{}' enviado correctamente.", tipoCorreo);
        } catch (Exception e) {
            logger.error("Error al enviar correo tipo '{}': {}", tipoCorreo, e.getMessage(), e);
        }
    }
}
