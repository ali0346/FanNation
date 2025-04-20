package com.fannation.repository;

import com.fannation.model.Category;
import com.fannation.model.Poll;
import com.fannation.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    Page<Poll> findByCategoryOrderByCreatedAtDesc(Category category, Pageable pageable);
    
    Page<Poll> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Poll> findByExpiresAtGreaterThanOrderByCreatedAtDesc(LocalDateTime now);
}
