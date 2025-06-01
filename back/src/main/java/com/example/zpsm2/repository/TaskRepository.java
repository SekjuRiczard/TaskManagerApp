package com.example.zpsm2.repository;

import com.example.zpsm2.dto.DateStatDto;
import com.example.zpsm2.dto.StatDto;
import com.example.zpsm2.dto.TaskResponse;
import com.example.zpsm2.dto.TaskStatsDTO;
import com.example.zpsm2.model.Task;
import com.example.zpsm2.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Integer> {
    List<TaskResponse>    findAllByUserId(Integer userId);
    Optional<TaskResponse> findProjectedById(Integer taskId);

    /** Zlicza wszystkie zadania danego usera */
    long countByUserId(Integer userId);
    /** Zliczy tylko zadania z status = COMPLETED */
    long countByUserIdAndTaskStatus(Integer userId, TaskStatus status);


    @Query("""
      SELECT new com.example.zpsm2.dto.StatDto(
        t.taskStatus,
        COUNT(t)
      )
      FROM Task t
      WHERE t.user.id = :userId
      GROUP BY t.taskStatus
    """)
    List<StatDto> countByStatus(@Param("userId") Integer userId);

    /**
     * Rozkład po priorytetach — StatDto(Integer priority, long count)
     */
    @Query("""
      SELECT new com.example.zpsm2.dto.StatDto(
        t.priority,
        COUNT(t)
      )
      FROM Task t
      WHERE t.user.id = :userId
      GROUP BY t.priority
      ORDER BY t.priority
    """)
    List<StatDto> countByPriority(@Param("userId") Integer userId);

    /**
     * Nowe zadania w ostatnich 7 dniach
     */
    @Query(value = """
      SELECT TO_CHAR(createdat, 'Dy') AS day,
             COUNT(*)             AS count
      FROM tasks
      WHERE user_id = :userId
        AND createdat >= now() - INTERVAL '6 days'
      GROUP BY TO_CHAR(createdat, 'Dy')
      ORDER BY MIN(createdat)
    """, nativeQuery = true)
    List<DateStatDto> countNewTasksLast7Days(@Param("userId") Integer userId);
}

