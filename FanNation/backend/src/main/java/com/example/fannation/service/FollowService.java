package com.example.fannation.service;

import com.example.fannation.entity.UserCategoryFollow;
import com.example.fannation.repository.UserCategoryFollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FollowService {
    @Autowired
    private UserCategoryFollowRepository followRepository;

    public boolean isFollowing(Integer userId, Integer categoryId) {
        return followRepository.findByUserIdAndCategoryId(userId, categoryId) != null;
    }

    public void followCategory(Integer userId, Integer categoryId) {
        if (!isFollowing(userId, categoryId)) {
            UserCategoryFollow follow = new UserCategoryFollow();
            follow.setUserId(userId);
            follow.setCategoryId(categoryId);
            followRepository.save(follow);
        }
    }

    public void unfollowCategory(Integer userId, Integer categoryId) {
        followRepository.deleteByUserIdAndCategoryId(userId, categoryId);
    }
}