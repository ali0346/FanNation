package com.example.fannation.dto;

import lombok.Data;

@Data
public class ThreadDTO {
    private Integer id;
    private String title;
    private String content;
    private Integer createdBy;
    private Integer categoryId;
    private String createdAt;
}