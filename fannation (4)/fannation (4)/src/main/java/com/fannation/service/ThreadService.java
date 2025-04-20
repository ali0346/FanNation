package com.fannation.service;

import com.fannation.dto.ThreadDto;
import com.fannation.model.Category;
import com.fannation.model.Thread;
import com.fannation.model.User;
import com.fannation.repository.CategoryRepository;
import com.fannation.repository.ThreadRepository;
import com.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ThreadService {
    @Autowired
    private ThreadRepository threadRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    public Page<ThreadDto> getAllThreads(Pageable pageable) {
        return threadRepository.findAll(pageable)
                .map(this::mapThreadToDto);
    }

    public ThreadDto getThreadById(Long id) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        // Increment view count
        thread.setViewCount(thread.getViewCount() + 1);
        threadRepository.save(thread);
        
        return mapThreadToDto(thread);
    }

    public Page<ThreadDto> getThreadsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        return threadRepository.findByCategoryOrderByCreatedAtDesc(category, pageable)
                .map(this::mapThreadToDto);
    }

    public Page<ThreadDto> getThreadsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return threadRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::mapThreadToDto);
    }

    public ThreadDto createThread(ThreadDto threadDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Category category = categoryRepository.findById(threadDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        Thread thread = new Thread();
        thread.setTitle(threadDto.getTitle());
        thread.setContent(threadDto.getContent());
        thread.setUser(user);
        thread.setCategory(category);
        
        thread = threadRepository.save(thread);
        return mapThreadToDto(thread);
    }

    public ThreadDto updateThread(Long id, ThreadDto threadDto) {
        Thread thread = threadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
                
        // Check if user is authorized to update (implementation not shown)
        
        thread.setTitle(threadDto.getTitle());
        thread.setContent(threadDto.getContent());
        
        if (threadDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(threadDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            thread.setCategory(category);
        }
        
        thread = threadRepository.save(thread);
        return mapThreadToDto(thread);
    }

    public void deleteThread(Long id) {
        threadRepository.deleteById(id);
    }

    public Page<ThreadDto> searchThreads(String keyword, Pageable pageable) {
        return threadRepository.searchThreads(keyword, pageable)
                .map(this::mapThreadToDto);
    }

    public Page<ThreadDto> getPopularThreads(Pageable pageable) {
        return threadRepository.findTopThreadsByLikes(pageable)
                .map(this::mapThreadToDto);
    }
    
    @Transactional
    public void likeThread(Long threadId, Long userId) {
        Thread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        thread.getLikes().add(user);
        threadRepository.save(thread);
    }
    
    @Transactional
    public void unlikeThread(Long threadId, Long userId) {
        Thread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new RuntimeException("Thread not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        thread.getLikes().remove(user);
        threadRepository.save(thread);
    }
    
    private ThreadDto mapThreadToDto(Thread thread) {
        ThreadDto dto = new ThreadDto();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setContent(thread.getContent());
        dto.setAuthorId(thread.getUser().getId());
        dto.setAuthorName(thread.getUser().getUsername());
        dto.setCategoryId(thread.getCategory().getId());
        dto.setCategoryName(thread.getCategory().getName());
        dto.setLikeCount(thread.getLikes().size());
        dto.setCommentCount(thread.getComments().size());
        dto.setViewCount(thread.getViewCount());
        dto.setCreatedAt(thread.getCreatedAt());
        return dto;
    }
}
