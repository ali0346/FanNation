package com.fannation.repository;

import com.fannation.model.Category;
import com.fannation.model.Thread;
import com.fannation.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreadRepository extends JpaRepository<Thread, Long> {
    Page<Thread> findByCategoryOrderByCreatedAtDesc(Category category, Pageable pageable);
    
    Page<Thread> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT t FROM Thread t ORDER BY SIZE(t.likes) DESC")
    Page<Thread> findTopThreadsByLikes(Pageable pageable);
    
    @Query("SELECT t FROM Thread t ORDER BY SIZE(t.comments) DESC")
    Page<Thread> findTopThreadsByComments(Pageable pageable);
    
    @Query("SELECT t FROM Thread t WHERE t.title LIKE %?1% OR t.content LIKE %?1%")
    Page<Thread> searchThreads(String keyword, Pageable pageable);
}
