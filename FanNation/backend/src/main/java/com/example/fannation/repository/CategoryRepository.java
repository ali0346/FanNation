// backend/src/main/java/com/example/fannation/repository/CategoryRepository.java
package com.example.fannation.repository;

import com.example.fannation.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}