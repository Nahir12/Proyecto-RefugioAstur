package com.dwes.ApiRestBackEnd.config.filter;

import com.dwes.ApiRestBackEnd.dto.UsuarioLogginDTO;
import com.dwes.ApiRestBackEnd.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.dwes.ApiRestBackEnd.config.TokenJwtConfig.*;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UsuarioRepository usuarioRepositorio) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepositorio;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        UsuarioLogginDTO usuarioLoginDto;
        String email;
        String contraseña;
        try {
            usuarioLoginDto = new ObjectMapper().readValue(request.getInputStream(), UsuarioLogginDTO.class);
            email = usuarioLoginDto.getEmail();
            contraseña = usuarioLoginDto.getContraseña();
        } catch (IOException e) {
            throw new RuntimeException("Error al parsear las credenciales de login: " + e.getMessage(), e);
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, contraseña);
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication auth)
            throws IOException, ServletException {
        org.springframework.security.core.userdetails.User user =
                (org.springframework.security.core.userdetails.User) auth.getPrincipal();
        String email = user.getUsername();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        // Extraer roles de las authorities y convertirlos en una lista de String
        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        System.out.println("Usuario autenticado: " + email);
        System.out.println("Roles asignados: " + roles);

        // Se extrae el ID y se comprueba si el usuario es temporal a partir del repositorio
        Long usuarioID = usuarioRepository.findByEmail(email).get().getIdUsuario();
        boolean esTemporal = usuarioRepository.findByEmail(email).get().getEsTemporal();
        System.out.println("ID del usuario obtenido: " + usuarioID);
        System.out.println("¿Usuario es temporal?: " + esTemporal);

        // Se construyen las claims agregando el usuarioID, el  esTemporal y demás datos
        Claims claims = Jwts.claims()
                .add("usuarioID", usuarioID)
                .add("esTemporal", esTemporal)
                .add("authorities", roles)
                .add("username", email)
                .add("isAdmin", roles.contains("ROLE_ADMIN"))
                .build();

        System.out.println("Claims generadas para el token: " + claims);

        String token = Jwts.builder()
                .setSubject(email)
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .setIssuedAt(new Date())
                .signWith(SECRET_KEY)
                .compact();

        response.addHeader(HEADER_AUTHORIZATION, PREFIX_TOKEN + token);

        Map<String, Object> body = new HashMap<>();
        body.put("token", token);
        body.put("username", email);
        body.put("message", String.format("Hola %s, ¡bienvenido de nuevo!", email));
        body.put("roles", roles);

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(body));
        response.setContentType(CONTENT_TYPE);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        Map<String, String> body = new HashMap<>();
        body.put("message", "Error: email o contraseña incorrectos.");
        body.put("error", failed.getMessage());
        response.getWriter().write(new ObjectMapper().writeValueAsString(body));
        response.setContentType(CONTENT_TYPE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
