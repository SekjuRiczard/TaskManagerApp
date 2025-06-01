package com.example.zpsm2.service;

import com.example.zpsm2.dto.*;
import com.example.zpsm2.model.Task;
import com.example.zpsm2.model.TaskStatus;
import com.example.zpsm2.model.User;
import com.example.zpsm2.repository.TaskRepository;
import com.example.zpsm2.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponse> getAllTasksByUserId(Integer userId) {
        return taskRepository.findAllByUserId(userId);
    }

    public TaskResponse getTaskById(Integer taskId) {
        return taskRepository.findProjectedById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
    }

    public TaskResponse createTask(Integer userId, TaskRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Task t = new Task();
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setTaskStatus(TaskStatus.valueOf(req.getStatus()));
        t.setPriority(req.getPriority());
        t.setDueDate(req.getDueDate());
        t.setUser(user);

        Task saved = taskRepository.save(t);
        return taskRepository.findProjectedById(saved.getId()).get();
    }

    public TaskResponse updateTaskById(Integer taskId, TaskRequest req) {
        Task t = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setTaskStatus(TaskStatus.valueOf(req.getStatus()));
        t.setPriority(req.getPriority());
        t.setDueDate(req.getDueDate());
        taskRepository.save(t);
        return taskRepository.findProjectedById(taskId).get();
    }

    public TaskResponse deleteTaskById(Integer taskId) {
        TaskResponse dto = getTaskById(taskId);
        taskRepository.deleteById(taskId);
        return dto;
    }

    public TaskStatsDTO getStatsByUserId(Integer userId) {
        Long total     = taskRepository.countByUserId(userId);
        Long completed = taskRepository.countByUserIdAndTaskStatus(userId, TaskStatus.COMPLETED);
        return new TaskStatsDTO(completed, total);
    }
    public List<StatDto> getStatusStats(Integer userId) {
        return taskRepository.countByStatus(userId);
    }
    public List<StatDto> getPriorityStats(Integer userId) {
        return taskRepository.countByPriority(userId);
    }
    public List<DateStatDto> getNewTasks(Integer userId) {
        return taskRepository.countNewTasksLast7Days(userId);
    }

}
