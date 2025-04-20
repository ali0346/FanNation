package com.fannation.config;

import com.fannation.model.ERole;
import com.fannation.model.Role;
import com.fannation.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        for (ERole role : ERole.values()) {
            try {
                if (roleRepository.findByName(role).isEmpty()) {
                    roleRepository.save(new Role(role));
                    System.out.println("Created role: " + role);
                }
            } catch (Exception e) {
                System.err.println("Error creating role " + role + ": " + e.getMessage());
            }
        }
    }
}
