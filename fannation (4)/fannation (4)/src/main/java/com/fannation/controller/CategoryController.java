package com.fannation.controller;

import com.fannation.dto.CategoryDto;
import com.fannation.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {
        CategoryDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<CategoryDto>> getTrendingCategories() {
        List<CategoryDto> categories = categoryService.getTrendingCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDto created = categoryService.createCategory(categoryDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id, @RequestBody CategoryDto categoryDto) {
        CategoryDto updated = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{categoryId}/follow")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> followCategory(@PathVariable Long categoryId, @RequestParam Long userId) {
        categoryService.followCategory(categoryId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{categoryId}/unfollow")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unfollowCategory(@PathVariable Long categoryId, @RequestParam Long userId) {
        categoryService.unfollowCategory(categoryId, userId);
        return ResponseEntity.ok().build();
    }
}
