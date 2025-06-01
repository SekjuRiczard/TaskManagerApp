package com.example.zpsm2.dto;

public class TaskStatsDTO {
    private final Long completedCount;
    private final Long totalCount;

    public TaskStatsDTO(Long completedCount, Long totalCount) {
        this.completedCount = completedCount;
        this.totalCount     = totalCount;
    }

    public Long getCompletedCount() {
        return completedCount;
    }

    public Long getTotalCount() {
        return totalCount;
    }
}
