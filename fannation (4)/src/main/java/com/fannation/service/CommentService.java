package com.fannation.service;

import com.fannation.dto.CommentDto;
import com.fannation.model.Comment;
import com.fannation.model.Thread;
import com.fannation.model.User;
import com.fannation.repository.CommentRepository;
import com.fannation.repository.ThreadRepository;
import com.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private ThreadRepository threadRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Page<CommentDto> getCommentsByThread(Long threadId, Pageable pageable) {
        Thread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
                
        return commentRepository.findByThreadOrderByCreatedAtDesc(thread, pageable)
                .map(this::mapCommentToDto);
    }

    public Page<CommentDto> getCommentsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return commentRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::mapCommentToDto);
    }

    public CommentDto createComment(CommentDto commentDto, Long threadId, Long userId) {
        Thread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(user);
        comment.setThread(thread);
        
        comment = commentRepository.save(comment);
        
        // Update user points
        user.setPoints(user.getPoints() + 2);
        userRepository.save(user);
        
        return mapCommentToDto(comment);
    }

    public CommentDto replyToComment(CommentDto commentDto, Long parentId, Long threadId, Long userId) {
        Thread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Comment parentComment = commentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
                
        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(user);
        comment.setThread(thread);
        comment.setParentComment(parentComment);
        
        comment = commentRepository.save(comment);
        
        // Update user points
        user.setPoints(user.getPoints() + 2);
        userRepository.save(user);
        
        return mapCommentToDto(comment);
    }

    public CommentDto updateComment(Long id, CommentDto commentDto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
                
        // Check if user is authorized to update (implementation not shown)
        
        comment.setContent(commentDto.getContent());
        comment = commentRepository.save(comment);
        
        return mapCommentToDto(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
    
    @Transactional
    public void likeComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        comment.getLikes().add(user);
        commentRepository.save(comment);
        
        // Update comment author's points
        User commentAuthor = comment.getUser();
        commentAuthor.setPoints(commentAuthor.getPoints() + 1);
        userRepository.save(commentAuthor);
    }
    
    @Transactional
    public void unlikeComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        comment.getLikes().remove(user);
        commentRepository.save(comment);
        
        // Update comment author's points
        User commentAuthor = comment.getUser();
        commentAuthor.setPoints(commentAuthor.getPoints() - 1);
        userRepository.save(commentAuthor);
    }
    
    private CommentDto mapCommentToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorId(comment.getUser().getId());
        dto.setAuthorName(comment.getUser().getUsername());
        dto.setThreadId(comment.getThread().getId());
        
        if (comment.getParentComment() != null) {
            dto.setParentId(comment.getParentComment().getId());
        }
        
        dto.setLikeCount(comment.getLikes().size());
        dto.setRepliesCount(comment.getReplies().size());
        
        dto.setReplies(comment.getReplies().stream()
                .map(this::mapCommentToDto)
                .collect(Collectors.toList()));
                
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
