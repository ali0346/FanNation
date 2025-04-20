package com.fannation.controller;

import com.fannation.dto.UserDto;
import com.fannation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable String username) {
        UserDto userDto = userService.getUserByUsername(username);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        UserDto updated = userService.updateUser(id, userDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/profile-picture")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        UserDto updated = userService.uploadProfilePicture(id, file);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{userId}/follow/{targetId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> followUser(@PathVariable Long userId, @PathVariable Long targetId) {
        userService.followUser(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/unfollow/{targetId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long userId, @PathVariable Long targetId) {
        userService.unfollowUser(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/top-contributors")
    public ResponseEntity<List<UserDto>> getTopContributors() {
        List<UserDto> users = userService.getTopContributors();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/role/{roleId}")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable Long userId, @PathVariable Long roleId) {
        UserDto updated = userService.updateUserRole(userId, roleId);
        return ResponseEntity.ok(updated);
    }
}
