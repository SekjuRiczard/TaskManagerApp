export const API_URLS = {
    //AUTH CONTROLLER
    AUTH:{
        LOGIN:'/auth/login',
        REGISTER:'/auth/register'
    },
    TASKS:{
        GET_USER_TASKS:`/tasks`,
        GET_SINGLE_TASK:(id:string)=>`/tasks/${id}`,
        ADD_TASK:`/tasks`,
        UPDATE_TASK:(id:string)=>`/tasks/${id}`,
        DELETE_TASK:(id:string)=>`/tasks/${id}`,
        TASK_STATS:`/tasks/stats`,
        STATUS_STATS:'/tasks/status/stats',
        PRIORITY_STATS:'/tasks/priority/stats',
        NEW_TASKS_STATS:"/tasks/new-tasks/stats"
    },
    USER:{
        GET_USER_INFO:`/users/me`
    }
}