package com.dwes.ApiRestBackEnd.config;

import com.dwes.ApiRestBackEnd.config.filter.JwtAuthenticationFilter;
import com.dwes.ApiRestBackEnd.config.filter.JwtValidationFilter;
import com.dwes.ApiRestBackEnd.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;

import java.util.Arrays;

@Configuration
public class SpringSecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final UsuarioRepository usuarioRepositorio;

    @Autowired
    public SpringSecurityConfig(AuthenticationConfiguration authenticationConfiguration,
                                UsuarioRepository usuarioRepositorio) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(authz -> authz
                        // Rutas públicas
                        .requestMatchers(HttpMethod.GET, "/imagenesCasa/obtener/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/casa/obtenerCasa/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/encriptar-passwords").permitAll()
                        .requestMatchers(HttpMethod.GET, "/casa/recientes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/casaCaracteristica/buscarCaracteristicasPorCasa/{idCasa}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/casa/obtenerCasas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/caracteristica/obtenerCaracteristica").permitAll()
                        .requestMatchers(HttpMethod.GET, "/casaCaracteristica/obtenerCaracteristicas").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuario/registrar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/casa/buscarCasasFiltro").permitAll()

                        // Endpoints de alquiler que son públicos:
                        .requestMatchers(HttpMethod.POST, "/alquiler/crearAlquiler").permitAll()
                        .requestMatchers(HttpMethod.GET, "/alquiler/sacarTotal/**").permitAll()

                        // Endpoints que requieren autenticación con rol USER o ADMIN:
                        .requestMatchers(HttpMethod.GET, "/alquiler/ObtenerAlquileres").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/alquiler/eliminarAlquiler/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/alquilerUsuario/{usuarioID}").hasAnyRole("USER", "ADMIN")

                        // Endpoints de gestión de imágenes - SOLO ADMIN:
                        .requestMatchers(HttpMethod.POST, "/imagenesCasa/crearImagenCasa").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/imagenesCasa/actualizarImagen/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/imagenesCasa/eliminarImagen/**").hasRole("ADMIN")

                        // Endpoint que requiere rol ADMIN:
                        .requestMatchers(HttpMethod.GET, "/usuario/obtenerUsuarios").hasRole("ADMIN")

                        // Cualquier otra solicitud necesita autenticación.
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(authenticationManager(), usuarioRepositorio),
                        UsernamePasswordAuthenticationFilter.class
                )
                .addFilterBefore(
                        new JwtValidationFilter(authenticationManager()),
                        UsernamePasswordAuthenticationFilter.class
                )
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permite cualquier origen para desarrollo; en producción, especificar con cuidado.
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public FilterRegistrationBean<org.springframework.web.filter.CorsFilter> corsFilter() {
        FilterRegistrationBean<org.springframework.web.filter.CorsFilter> corsBean =
                new FilterRegistrationBean<>(new org.springframework.web.filter.CorsFilter(corsConfigurationSource()));
        corsBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return corsBean;
    }
}
