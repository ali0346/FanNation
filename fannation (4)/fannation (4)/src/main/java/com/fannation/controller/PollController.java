package com.fannation.controller;

import com.fannation.dto.PollDto;
import com.fannation.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/polls")
@CrossOrigin
public class PollController {
    @Autowired
    private PollService pollService;

    @GetMapping
    public ResponseEntity<Page<PollDto>> getAllPolls(Pageable pageable) {
        Page<PollDto> polls = pollService.getAllPolls(pageable);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PollDto> getPollById(@PathVariable Long id) {
        PollDto poll = pollService.getPollById(id);
        return ResponseEntity.ok(poll);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<PollDto>> getPollsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        Page<PollDto> polls = pollService.getPollsByCategory(categoryId, pageable);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PollDto>> getPollsByUser(@PathVariable Long userId, Pageable pageable) {
        Page<PollDto> polls = pollService.getPollsByUser(userId, pageable);
        return ResponseEntity.ok(polls);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PollDto>> getActivePolls() {
        List<PollDto> polls = pollService.getActivePolls();
        return ResponseEntity.ok(polls);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PollDto> createPoll(@RequestBody PollDto pollDto, @RequestParam Long userId) {
        PollDto created = pollService.createPoll(pollDto, userId);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/vote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PollDto> votePoll(@RequestParam Long optionId, @RequestParam Long userId) {
        PollDto updated = pollService.votePoll(optionId, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deletePoll(@PathVariable Long id) {
        pollService.deletePoll(id);
        return ResponseEntity.noContent().build();
    }
}
