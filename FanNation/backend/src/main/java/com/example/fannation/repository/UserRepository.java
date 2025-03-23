package com.example.fannation.repository;

import com.example.fannation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findBySessionToken(String sessionToken);

    Optional<User> findByUsername(String username); // Add this method
}