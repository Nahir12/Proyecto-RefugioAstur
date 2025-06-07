package com.dwes.ApiRestBackEnd.config.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.dwes.ApiRestBackEnd.config.TokenJwtConfig.*;

public class JwtValidationFilter extends BasicAuthenticationFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationFilter.class);

    public JwtValidationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String header = request.getHeader(HEADER_AUTHORIZATION);
        logger.debug("JwtValidationFilter: URI: {}", request.getRequestURI());
        logger.debug("JwtValidationFilter: Header Authorization: {}", header);

        if (header == null || !header.startsWith(PREFIX_TOKEN)) {
            logger.debug("JwtValidationFilter: No Authorization header or no Bearer prefix, passing to next filter.");
            chain.doFilter(request, response);
            return;
        }

        String token = "";
        try {
            token = header.replace(PREFIX_TOKEN, "");
            logger.debug("JwtValidationFilter: Extracted Token: {}", token);

            logger.debug("JwtValidationFilter: Attempting to parse JWT token.");
            Claims claims = Jwts.parser()
                    .verifyWith((SecretKey) SECRET_KEY)
                    .build()
                    .parseSignedClaims(token).getPayload();
            logger.debug("JwtValidationFilter: JWT token parsed successfully. Claims: {}", claims);

            String email = claims.getSubject();
            if (email == null) {
                email = claims.get("username", String.class);
            }
            logger.debug("JwtValidationFilter: Username/Subject from token: {}", email);

            Long usuarioID = claims.get("usuarioID", Long.class);
            if (usuarioID != null) {
                logger.debug("JwtValidationFilter: UsuarioID from token: {}", usuarioID);
            } else {
                logger.warn("JwtValidationFilter: 'usuarioID' claim is missing in the token.");
            }

            Object authoritiesClaim = claims.get("authorities");
            if (authoritiesClaim == null) {
                logger.error("JwtValidationFilter: 'authorities' claim is missing in the token!");
                throw new JwtException("'authorities' claim is missing");
            }
            if (!(authoritiesClaim instanceof List)) {
                logger.error("JwtValidationFilter: 'authorities' claim is not a List! Actual type: {}", authoritiesClaim.getClass().getName());
                throw new JwtException("'authorities' claim is not a List");
            }

            List<String> rolesList = (List<String>) authoritiesClaim;
            logger.debug("JwtValidationFilter: Roles from token: {}", rolesList);

            List<SimpleGrantedAuthority> authorities = rolesList.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            logger.info("JwtValidationFilter: Authentication set for user: {} with authorities: {}", email, authorities);

            chain.doFilter(request, response);

        } catch (JwtException e) {
            logger.error("JwtValidationFilter: JWT Exception during token validation. Token: [{}]. Error: {}", token, e.getMessage(), e);

            Map<String, String> body = new HashMap<>();
            body.put("error", e.getMessage());
            body.put("message", "El token JWT es inválido o ha expirado.");
            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(CONTENT_TYPE);
        } catch (Exception e) {
            logger.error("JwtValidationFilter: Unexpected exception during token processing. Token: [{}]. Error: {}", token, e.getMessage(), e);

            Map<String, String> body = new HashMap<>();
            body.put("error", "Error procesando la autenticación.");
            body.put("message", e.getMessage());
            response.getWriter().write(new ObjectMapper().writeValueAsString(body));
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setContentType(CONTENT_TYPE);
        }
    }
}
