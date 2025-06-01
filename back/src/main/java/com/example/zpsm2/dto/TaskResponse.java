package com.example.zpsm2.dto;

import com.example.zpsm2.model.TaskStatus;

import java.time.LocalDateTime;

public interface TaskResponse {
    Integer getId();
    String getTitle();
    String getDescription();
    TaskStatus getTaskStatus();
    int getPriority();
    LocalDateTime getDueDate();
    Integer getUserId();
}
