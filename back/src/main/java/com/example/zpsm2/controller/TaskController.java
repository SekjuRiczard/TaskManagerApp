package com.example.zpsm2.controller;

import com.example.zpsm2.dto.*;
import com.example.zpsm2.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    /** GET /tasks → lista zadań zalogowanego użytkownika */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getMyTasks() {
        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        List<TaskResponse> tasks = service.getAllTasksByUserId(Integer.valueOf(userId));
        return ResponseEntity.ok(tasks);
    }

    /** GET /tasks/{taskId} → pobiera pojedyncze zadanie (możesz w serwisie sprawdzić, czy należy do usera) */
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getById(@PathVariable Integer taskId) {
        TaskResponse task = service.getTaskById(taskId);
        return ResponseEntity.ok(task);
    }

    /** POST /tasks → tworzy nowe zadanie dla zalogowanego użytkownika */
    @PostMapping
    public ResponseEntity<TaskResponse> create(@RequestBody TaskRequest req) {
        String userId = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        TaskResponse created = service.createTask(Integer.valueOf(userId), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /** PUT /tasks/{taskId} → aktualizuje zadanie (serwis powinien zweryfikować właściciela) */
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Integer taskId,
            @RequestBody TaskRequest req
    ) {
        TaskResponse updated = service.updateTaskById(taskId, req);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /tasks/{taskId} → usuwa zadanie (również sprawdź w serwisie, czy user ma do tego prawo) */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<TaskResponse> delete(@PathVariable Integer taskId) {
        TaskResponse deleted = service.deleteTaskById(taskId);
        return ResponseEntity.ok(deleted);
    }

    @GetMapping("/stats")
    public ResponseEntity<TaskStatsDTO> getStats() {
        String uid = (String) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        Integer userId = Integer.valueOf(uid);
        TaskStatsDTO stats = service.getStatsByUserId(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/status/stats")
    public ResponseEntity<List<StatDto>>getStatusStats(){
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = Integer.valueOf(uid);
        return ResponseEntity.ok(service.getStatusStats(userId));
    }


    @GetMapping("/priority/stats")
    public ResponseEntity<List<StatDto>> getPriorityStats() {
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = Integer.valueOf(uid);
        List<StatDto> stats = service.getPriorityStats(userId);
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/new-tasks/stats")
    public ResponseEntity<List<DateStatDto>> getNewTasksStats() {
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = Integer.valueOf(uid);
        List<DateStatDto> stats = service.getNewTasks(userId);
        return ResponseEntity.ok(stats);
    }

}
