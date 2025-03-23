package com.example.fannation.repository;

import com.example.fannation.entity.AuthenticationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationLogRepository extends JpaRepository<AuthenticationLog, Integer> {
}