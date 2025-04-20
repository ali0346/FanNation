package com.fannation.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

  private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

  @Value("${app.jwtSecret}")
  private String jwtSecret;

  @Value("${app.jwtExpirationInMs}")
  private int jwtExpirationInMs;
  
  private Key getSigningKey() {
    // Convert the string secret to a secure key with proper length
    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  public String generateToken(Authentication authentication) {
      UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      
      logger.info("Generating JWT token for user: {}", userDetails.getUsername());
      
      Date now = new Date();
      Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
      
      String token = Jwts.builder()
              .setSubject(userDetails.getUsername())
              .setIssuedAt(new Date())
              .setExpiration(expiryDate)
              .signWith(getSigningKey())
              .compact();
              
      logger.info("JWT token generated successfully for user: {}", userDetails.getUsername());
      return token;
  }

  public String getUsernameFromJWT(String token) {
      Claims claims = Jwts.parserBuilder()
              .setSigningKey(getSigningKey())
              .build()
              .parseClaimsJws(token)
              .getBody();

      return claims.getSubject();
  }

  public boolean validateToken(String authToken) {
      try {
          Jwts.parserBuilder()
              .setSigningKey(getSigningKey())
              .build()
              .parseClaimsJws(authToken);
          return true;
      } catch (SignatureException ex) {
          logger.error("Invalid JWT signature");
      } catch (MalformedJwtException ex) {
          logger.error("Invalid JWT token");
      } catch (ExpiredJwtException ex) {
          logger.error("Expired JWT token");
      } catch (UnsupportedJwtException ex) {
          logger.error("Unsupported JWT token");
      } catch (IllegalArgumentException ex) {
          logger.error("JWT claims string is empty");
      }
      return false;
  }
}
