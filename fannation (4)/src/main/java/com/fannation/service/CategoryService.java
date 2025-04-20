package com.fannation.service;

import com.fannation.dto.CategoryDto;
import com.fannation.model.Category;
import com.fannation.model.User;
import com.fannation.repository.CategoryRepository;
import com.fannation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return mapCategoryToDto(category);
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setIconName(categoryDto.getIconName());
        
        category = categoryRepository.save(category);
        return mapCategoryToDto(category);
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setIconName(categoryDto.getIconName());
        
        category = categoryRepository.save(category);
        return mapCategoryToDto(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public List<CategoryDto> getTrendingCategories() {
        return categoryRepository.findTopCategories().stream()
                .limit(5)
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void followCategory(Long categoryId, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.getFollowedCategories().add(category);
        userRepository.save(user);
    }
    
    @Transactional
    public void unfollowCategory(Long categoryId, Long userId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
                
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.getFollowedCategories().remove(category);
        userRepository.save(user);
    }
    
    private CategoryDto mapCategoryToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIconName(category.getIconName());
        dto.setThreadCount(category.getThreads().size());
        dto.setFollowerCount(category.getFollowers().size());
        dto.setCreatedAt(category.getCreatedAt());
        return dto;
    }
}
