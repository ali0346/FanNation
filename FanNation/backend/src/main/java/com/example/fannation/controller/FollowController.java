package com.example.fannation.controller;

import com.example.fannation.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
    @Autowired
    private FollowService followService;

    @GetMapping("/status/{categoryId}")
    public ResponseEntity<Boolean> isFollowing(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer categoryId) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = 1; // Replace with actual userId from token
        return ResponseEntity.ok(followService.isFollowing(userId, categoryId));
    }

    @PostMapping("/category/{categoryId}")
    public ResponseEntity<String> followCategory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer categoryId) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = 1; // Replace with actual userId from token
        followService.followCategory(userId, categoryId);
        return ResponseEntity.ok("Followed successfully");
    }

    @DeleteMapping("/category/{categoryId}")
    public ResponseEntity<String> unfollowCategory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer categoryId) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = 1; // Replace with actual userId from token
        followService.unfollowCategory(userId, categoryId);
        return ResponseEntity.ok("Unfollowed successfully");
    }
}