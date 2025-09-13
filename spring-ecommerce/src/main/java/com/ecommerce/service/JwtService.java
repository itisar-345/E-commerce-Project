package com.ecommerce.service;

import com.ecommerce.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    
    @Value("${JWT_SECRET}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}")
    private Long expiration;
    
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getUserid())
                .claim("userType", user.getUsertype())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
    
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean validateToken(String token, String email) {
        try {
            String tokenEmail = extractEmail(token);
            return tokenEmail.equals(email) && isTokenValid(token);
        } catch (Exception e) {
            return false;
        }
    }
}