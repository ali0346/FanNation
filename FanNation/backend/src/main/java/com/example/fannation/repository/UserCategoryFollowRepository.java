package com.example.fannation.repository;

import com.example.fannation.entity.UserCategoryFollow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCategoryFollowRepository extends JpaRepository<UserCategoryFollow, Integer> {
    UserCategoryFollow findByUserIdAndCategoryId(Integer userId, Integer categoryId);

    void deleteByUserIdAndCategoryId(Integer userId, Integer categoryId);
}