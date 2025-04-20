package com.fannation.service;

import com.fannation.dto.UserDto;
import com.fannation.model.ERole;
import com.fannation.model.Role;
import com.fannation.model.User;
import com.fannation.repository.RoleRepository;
import com.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private final Path fileStorageLocation = Paths.get("uploads/profile-pictures").toAbsolutePath().normalize();
    
    public UserService() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToDto(user);
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToDto(user);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Only update fields that are allowed to be updated
        if (userDto.getBio() != null) {
            user.setBio(userDto.getBio());
        }
        
        // Email update requires validation
        if (userDto.getEmail() != null && !userDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            user.setEmail(userDto.getEmail());
        }
        
        user = userRepository.save(user);
        return mapUserToDto(user);
    }

    public UserDto uploadProfilePicture(Long id, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate a unique file name
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        try {
            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Update user profile picture path
            user.setProfilePicture("/uploads/profile-pictures/" + fileName);
            user = userRepository.save(user);
            
            return mapUserToDto(user);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }
    
    @Transactional
    public void followUser(Long userId, Long targetId) {
        if (userId.equals(targetId)) {
            throw new RuntimeException("Users cannot follow themselves");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));
                
        user.getFollowing().add(targetUser);
        userRepository.save(user);
    }
    
    @Transactional
    public void unfollowUser(Long userId, Long targetId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));
                
        user.getFollowing().remove(targetUser);
        userRepository.save(user);
    }
    
    public List<UserDto> getTopContributors() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparingInt(User::getPoints).reversed())
                .limit(10)
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public UserDto updateUserRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
                
        user.getRoles().add(role);
        user = userRepository.save(user);
        
        return mapUserToDto(user);
    }
    
    public UserDto changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user = userRepository.save(user);
        
        return mapUserToDto(user);
    }
    
    private UserDto mapUserToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList()));
        dto.setFollowersCount(user.getFollowers().size());
        dto.setFollowingCount(user.getFollowing().size());
        dto.setThreadCount(user.getThreads().size());
        dto.setCommentCount(user.getComments().size());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
