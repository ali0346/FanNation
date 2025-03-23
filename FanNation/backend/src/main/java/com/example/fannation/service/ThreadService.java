package com.example.fannation.service;

import com.example.fannation.dto.ThreadDTO;
import com.example.fannation.entity.Thread;
import com.example.fannation.repository.ThreadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThreadService {
    @Autowired
    private ThreadRepository threadRepository;

    public List<ThreadDTO> getThreadsByCategory(Integer categoryId) {
        return threadRepository.findByCategoryId(categoryId).stream().map(thread -> {
            ThreadDTO dto = new ThreadDTO();
            dto.setId(thread.getId());
            dto.setTitle(thread.getTitle());
            dto.setContent(thread.getContent());
            dto.setCreatedBy(thread.getCreatedBy());
            dto.setCategoryId(thread.getCategoryId());
            dto.setCreatedAt(thread.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
    }
}