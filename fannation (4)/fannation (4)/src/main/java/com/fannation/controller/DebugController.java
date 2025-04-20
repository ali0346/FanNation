package com.fannation.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

   @Autowired
   private PasswordEncoder passwordEncoder;

   @GetMapping("/ping")
   public ResponseEntity<Map<String, String>> ping() {
       Map<String, String> response = new HashMap<>();
       response.put("status", "success");
       response.put("message", "API is running");
       response.put("timestamp", String.valueOf(System.currentTimeMillis()));
       return ResponseEntity.ok(response);
   }
   
   @PostMapping("/check-password")
   public ResponseEntity<Map<String, Object>> checkPassword(@RequestBody Map<String, String> request) {
       String rawPassword = request.get("rawPassword");
       String encodedPassword = request.get("encodedPassword");
       
       Map<String, Object> response = new HashMap<>();
       response.put("rawPassword", rawPassword);
       response.put("encodedPassword", encodedPassword);
       
       boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
       response.put("matches", matches);
       
       if (!matches) {
           // Generate a new encoded password for comparison
           String newEncodedPassword = passwordEncoder.encode(rawPassword);
           response.put("newEncodedPassword", newEncodedPassword);
       }
       
       return ResponseEntity.ok(response);
   }
}
