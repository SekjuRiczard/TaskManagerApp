import httpClient from '../httpClient'
import { API_URLS } from '../urls'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface TaskRequest {
  title: string
  description: string
  status: string      
  priority: number
  dueDate: string      
}

export interface TaskResponse {
  id: number
  title: string
  description: string
  taskStatus: string   
  priority: number
  dueDate: string      
  userId: number
}

export interface TaskStats {
 completedCount: number
 totalCount: number
}

export interface TaskStatusStats {
   name: string
  count: number
}
export interface TaskPriorityStats {
  name: string
  count: number
}
export interface NewTasksStats {
  day: string,
  count: number
}


/**
 * Pobiera listę zadań zalogowanego użytkownika
 */
export async function getUserTasks(): Promise<TaskResponse[]> {
  const response = await httpClient.get<TaskResponse[]>(
    API_URLS.TASKS.GET_USER_TASKS
  )
  return response.data
}

/**
 * Pobiera pojedyncze zadanie po ID
 */
export async function getTaskById(id: number): Promise<TaskResponse> {
  const token = await AsyncStorage.getItem('token')
  const response = await httpClient.get<TaskResponse>(
    API_URLS.TASKS.GET_SINGLE_TASK(id.toString()),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}
/**
 * Tworzy nowe zadanie; backend sam wyciąga userId z tokena
 */
export async function addTask(task: TaskRequest): Promise<TaskResponse> {
  const response = await httpClient.post<TaskResponse>(
    API_URLS.TASKS.ADD_TASK,
    task
  )
  return response.data
}

/**
 * Aktualizuje istniejące zadanie
 */
export async function updateTask(
  id: number,
  task: Omit<TaskRequest, 'dueDate'> & { dueDate: string }
): Promise<TaskResponse> {
  const response = await httpClient.put<TaskResponse>(
    API_URLS.TASKS.UPDATE_TASK(id.toString()),
    task
  )
  return response.data
}

/**
 * Usuwa zadanie
 */
export async function deleteTask(id: number): Promise<void> {
  await httpClient.delete(
    API_URLS.TASKS.DELETE_TASK(id.toString())
  )
}


export async function getTaskStats(): Promise<TaskStats> {
  const response = await httpClient.get<any>(
    API_URLS.TASKS.TASK_STATS
  )
  return response.data
}

export async function getTaskStatusStats(): Promise<TaskStatusStats[]> {
  const token = await AsyncStorage.getItem('token')
  const response = await httpClient.get<TaskStatusStats[]>(
    API_URLS.TASKS.STATUS_STATS,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function getTaskPriorityStats(): Promise<TaskPriorityStats[]> {
  const token = await AsyncStorage.getItem('token')
  const response = await httpClient.get<TaskPriorityStats[]>(
    API_URLS.TASKS.PRIORITY_STATS,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

export async function getNewTasksStats(): Promise<NewTasksStats[]> {
  const token = await AsyncStorage.getItem('token')
  const response = await httpClient.get<NewTasksStats[]>(
    API_URLS.TASKS.NEW_TASKS_STATS,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}