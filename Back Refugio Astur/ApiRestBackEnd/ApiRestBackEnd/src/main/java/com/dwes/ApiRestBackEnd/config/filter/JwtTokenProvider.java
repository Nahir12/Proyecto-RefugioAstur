package com.dwes.ApiRestBackEnd.config.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    public Claims getClaimsFromToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isAdmin(String token) {
        Claims claims = getClaimsFromToken(token);
        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof List) {
            List<?> roles = (List<?>) rolesClaim;
            return roles.contains("ROLE_ADMIN");
        } else if (rolesClaim instanceof String) {
            return ((String) rolesClaim).contains("ROLE_ADMIN");
        }
        return false;
    }

    // Método para obtener el usuarioID desde el token
    public Long getUsuarioID(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("usuarioID", Long.class);
    }

    // Método para saber si el usuario es temporal
    public Boolean getEsTemporal(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("esTemporal", Boolean.class);
    }
}
