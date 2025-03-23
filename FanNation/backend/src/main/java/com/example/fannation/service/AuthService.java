package com.example.fannation.service;

import com.example.fannation.dto.LoginRequest;
import com.example.fannation.dto.SignupRequest;
import com.example.fannation.dto.UserResponse;
import com.example.fannation.entity.AuthenticationLog;
import com.example.fannation.entity.User;
import com.example.fannation.repository.AuthenticationLogRepository;
import com.example.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationLogRepository authLogRepository;

    public UserResponse login(LoginRequest request) {
        try {
            System.out.println("Login request received: " + request.getEmail());
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        System.out.println("User not found for email: " + request.getEmail());
                        logAuthAttempt(null, "Failed");
                        return new RuntimeException("Invalid credentials");
                    });
            System.out.println("User found: " + user.getUsername());

            if (!user.getPassword().equals(request.getPassword())) {
                System.out.println("Password mismatch for user: " + user.getUsername());
                logAuthAttempt(user.getId(), "Failed");
                throw new RuntimeException("Invalid credentials");
            }

            String token = UUID.randomUUID().toString();
            System.out.println("Generated token: " + token);
            user.setSessionToken(token);
            userRepository.save(user);
            System.out.println("User updated with token: " + token);

            logAuthAttempt(user.getId(), "Success");
            System.out.println("Auth attempt logged");

            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setToken(token);
            System.out.println("Login successful for user: " + user.getUsername() + ", token: " + token);
            return response;
        } catch (Exception e) {
            System.err.println("Error during login: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    public void signup(SignupRequest request) {
        System.out.println("hello");
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userRepository.save(user);
        String sessionToken = UUID.randomUUID().toString();
        System.out.println("sessiontoken" + sessionToken);

        user.setSessionToken(sessionToken);

        user = userRepository.save(user);
    }

    public UserResponse getUserByToken(String token) {
        System.out.println("Received token for validation: " + token);
        User user = userRepository.findBySessionToken(token)
                .orElseThrow(() -> {
                    System.out.println("No user found for token: " + token);
                    return new RuntimeException("Invalid token");
                });
        System.out.println("User found for token: " + user.getUsername());

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setToken(token);
        return response;
    }

    private void logAuthAttempt(Integer userId, String status) {
        try {
            System.out.println("Logging auth attempt: userId=" + userId + ", status=" + status);
            AuthenticationLog log = new AuthenticationLog();
            log.setUserId(userId);
            log.setStatus(AuthenticationLog.Status.valueOf(status));
            authLogRepository.save(log);
            System.out.println("Auth attempt logged successfully");
        } catch (Exception e) {
            System.err.println("Error logging auth attempt: " + e.getMessage());
            e.printStackTrace();
        }
    }
}