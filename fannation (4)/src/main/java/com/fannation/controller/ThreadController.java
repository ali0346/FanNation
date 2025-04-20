package com.fannation.controller;

import com.fannation.dto.ThreadDto;
import com.fannation.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/threads")
@CrossOrigin
public class ThreadController {
    @Autowired
    private ThreadService threadService;

    @GetMapping
    public ResponseEntity<Page<ThreadDto>> getAllThreads(Pageable pageable) {
        Page<ThreadDto> threads = threadService.getAllThreads(pageable);
        return ResponseEntity.ok(threads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreadDto> getThreadById(@PathVariable Long id) {
        ThreadDto thread = threadService.getThreadById(id);
        return ResponseEntity.ok(thread);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ThreadDto>> getThreadsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        Page<ThreadDto> threads = threadService.getThreadsByCategory(categoryId, pageable);
        return ResponseEntity.ok(threads);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ThreadDto>> getThreadsByUser(@PathVariable Long userId, Pageable pageable) {
        Page<ThreadDto> threads = threadService.getThreadsByUser(userId, pageable);
        return ResponseEntity.ok(threads);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ThreadDto>> searchThreads(@RequestParam String keyword, Pageable pageable) {
        Page<ThreadDto> threads = threadService.searchThreads(keyword, pageable);
        return ResponseEntity.ok(threads);
    }

    @GetMapping("/popular")
    public ResponseEntity<Page<ThreadDto>> getPopularThreads(Pageable pageable) {
        Page<ThreadDto> threads = threadService.getPopularThreads(pageable);
        return ResponseEntity.ok(threads);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ThreadDto> createThread(@RequestBody ThreadDto threadDto, @RequestParam Long userId) {
        ThreadDto created = threadService.createThread(threadDto, userId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ThreadDto> updateThread(@PathVariable Long id, @RequestBody ThreadDto threadDto) {
        ThreadDto updated = threadService.updateThread(id, threadDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteThread(@PathVariable Long id) {
        threadService.deleteThread(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{threadId}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeThread(@PathVariable Long threadId, @RequestParam Long userId) {
        threadService.likeThread(threadId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{threadId}/unlike")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeThread(@PathVariable Long threadId, @RequestParam Long userId) {
        threadService.unlikeThread(threadId, userId);
        return ResponseEntity.ok().build();
    }
}
