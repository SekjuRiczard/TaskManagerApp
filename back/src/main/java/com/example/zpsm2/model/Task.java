package com.example.zpsm2.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String description;
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)               // opcjonalnie, jeśli używasz Hibernate-owego JdbcType dla enumów
    @Column(
            name = "status",                                   // nazwa kolumny w tabeli
            nullable = false,
            columnDefinition = "task_status"                   // SQL-owy typ ENUM w Postgresie
    )
    private TaskStatus taskStatus;

    @Column(nullable = false)
    private Integer priority;

    @Column(name = "duedate", nullable = true)
    private LocalDateTime dueDate;

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getTitle() {
        return title;
    }

    public User getUser() {
        return user;
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public Integer getPriority() {
        return priority;
    }
}
