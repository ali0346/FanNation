package com.fannation.controller;

import com.fannation.dto.CommentDto;
import com.fannation.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/thread/{threadId}")
    public ResponseEntity<Page<CommentDto>> getCommentsByThread(@PathVariable Long threadId, Pageable pageable) {
        Page<CommentDto> comments = commentService.getCommentsByThread(threadId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<CommentDto>> getCommentsByUser(@PathVariable Long userId, Pageable pageable) {
        Page<CommentDto> comments = commentService.getCommentsByUser(userId, pageable);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDto> createComment(
            @RequestBody CommentDto commentDto,
            @RequestParam Long threadId,
            @RequestParam Long userId) {
        CommentDto created = commentService.createComment(commentDto, threadId, userId);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/reply")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDto> replyToComment(
            @RequestBody CommentDto commentDto,
            @RequestParam Long parentId,
            @RequestParam Long threadId,
            @RequestParam Long userId) {
        CommentDto created = commentService.replyToComment(commentDto, parentId, threadId, userId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CommentDto> updateComment(@PathVariable Long id, @RequestBody CommentDto commentDto) {
        CommentDto updated = commentService.updateComment(id, commentDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{commentId}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> likeComment(@PathVariable Long commentId, @RequestParam Long userId) {
        commentService.likeComment(commentId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/unlike")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unlikeComment(@PathVariable Long commentId, @RequestParam Long userId) {
        commentService.unlikeComment(commentId, userId);
        return ResponseEntity.ok().build();
    }
}
