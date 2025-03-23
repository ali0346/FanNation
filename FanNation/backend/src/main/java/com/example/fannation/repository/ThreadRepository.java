package com.example.fannation.repository;

import com.example.fannation.entity.Thread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreadRepository extends JpaRepository<Thread, Integer> {
    List<Thread> findByCategoryId(Integer categoryId);
}