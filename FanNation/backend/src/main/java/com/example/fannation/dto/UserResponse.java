package com.example.fannation.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Integer id;
    private String username;
    private String email;
    private String token;
}