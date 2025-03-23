// backend/src/main/java/com/example/fannation/service/CategoryService.java
package com.example.fannation.service;

import com.example.fannation.entity.Category;
import com.example.fannation.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public List<Category> getAllCategories() {
        return repository.findAll();
    }
}