package com.example.fannation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "AuthenticationLog")
@Data
public class AuthenticationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId; // Nullable to allow failed attempts with no user

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        Success, Failed
    }

    @PrePersist
    protected void onCreate() {
        loginTime = LocalDateTime.now();
    }
}