package com.example.zpsm2.dto;

import java.time.LocalDateTime;

// (opcjonalnie można tu dodać Lombok: @Data, @NoArgsConstructor, @AllArgsConstructor)
public class TaskRequest {
    private String title;
    private String description;
    private String status;         // tu trzymamy nazwę enuma jako String
    private int priority;
    private LocalDateTime dueDate; // camelCase!

    public TaskRequest() {}

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public int getPriority() {
        return priority;
    }
    public void setPriority(int priority) {
        this.priority = priority;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}
