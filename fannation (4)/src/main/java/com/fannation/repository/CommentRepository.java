package com.fannation.repository;

import com.fannation.model.Comment;
import com.fannation.model.Thread;
import com.fannation.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByThreadOrderByCreatedAtDesc(Thread thread, Pageable pageable);
    
    Page<Comment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
