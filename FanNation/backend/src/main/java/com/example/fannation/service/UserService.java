package com.example.fannation.service;

import com.example.fannation.entity.User;
import com.example.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String signup(String username, String email, String password) {
        System.out.println("hello");
        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        // Check if email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password); // Plain text password (insecure)

        // Generate session token and save it
        String sessionToken = UUID.randomUUID().toString();
        System.out.println("sessiontoken" + sessionToken);

        user.setSessionToken(sessionToken);

        user = userRepository.save(user);
        return sessionToken;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

}