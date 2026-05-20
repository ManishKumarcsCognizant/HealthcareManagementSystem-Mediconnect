package com.application.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtUtils {

    // IMPORTANT: JJWT 0.12.x requires a secret key that is at least 256 bits (32 characters/bytes) long for HS256.
    // "examly" is too short and will throw an InvalidKeyException at runtime.
    // Use a longer string like the one below:
    private final String secret = "examly_secure_secret_key_that_is_at_least_32_bytes_long";

    // Helper method to generate a secure SecretKey object from your string
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // FIX: Updated for JJWT 0.12.5 fluent parser API
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Replaced setSigningKey()
                .build()                     // Creates the JwtParser
                .parseSignedClaims(token)    // Replaced parseClaimsJws()
                .getPayload();               // Replaced getBody()
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    // FIX: Updated for JJWT 0.12.5 fluent builder API
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)              // Replaced setClaims()
                .subject(subject)            // Replaced setSubject()
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(getSigningKey())   // Replaced older signWith(Algorithm, secret) signature
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}