// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons'
import TaskProgressCard from '@/components/MyComponents/TaskProgressCard'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import {
  getUserTasks,
  getTaskStats,
  TaskResponse,
  TaskStats,
} from '../api/services/taskService'


export default function HomeScreen() {
  const navigation = useNavigation()
  const { user, isLoading: authLoading } = useAuth()
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }, [])

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      const data = await getUserTasks()
      setTasks(data)
    } catch (e) {
      console.error('Failed to load tasks:', e)
    } finally {
      setTasksLoading(false)
    }
  }, [])

  // Fetch stats
  const loadStats = useCallback(async () => {
    try {
      const s = await getTaskStats()
      setStats(s)
    } catch (e) {
      console.error('Failed to load stats:', e)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // Initial load when user is available
  useEffect(() => {
    if (user) {
      setTasksLoading(true)
      setStatsLoading(true)
      loadTasks()
      loadStats()
    }
  }, [user, loadTasks, loadStats])

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([loadTasks(), loadStats()])
    setRefreshing(false)
  }, [loadTasks, loadStats])

  // If auth is loading, show spinner
  if (authLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  // Today's date string
  const today = new Date().toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Helpers for priority display
  const getPriorityColor = (p: number) => {
    switch (p) {
      case 1:
        return 'green'
      case 2:
        return 'blue'
      case 3:
        return 'orange'
      case 4:
        return 'red'
      default:
        return '#ccc'
    }
  }
  const getPriorityLabel = (p: number) => {
    switch (p) {
      case 1:
        return 'Low'
      case 2:
        return 'Medium'
      case 3:
        return 'High'
      case 4:
        return 'Critical'
      default:
        return 'Unknown'
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Section 1: Greeting & Date */}
      <View style={styles.section1}>
        <Text style={styles.greeting}>
          Hi, {user?.username ?? 'Guest'}
        </Text>
        <Text style={styles.date}>{today}</Text>
      </View>

      {/* Section 2: Task progress */}
      <View style={styles.section2}>
        {statsLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <TaskProgressCard
            tasksCompleted={stats?.completedCount ?? 0}
            tasksTotal={stats?.totalCount ?? 0}
            title="Twój postęp"
          />
        )}
      </View>

      {/* Section 3: In Progress tasks */}
      <View style={styles.section3}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>In Progress</Text>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              )
              setCollapsed(!collapsed)
            }}
          >
            <MaterialIcons
              name={
                collapsed
                  ? 'keyboard-arrow-down'
                  : 'keyboard-arrow-up'
              }
              size={28}
              color="#000"
            />
          </TouchableOpacity>
        </View>
        {!collapsed && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {tasks
              .filter((t) => t.taskStatus === 'IN_PROGRESS')
              .map((task) => {
                const due = new Date(task.dueDate)
                const dateStr = due.toLocaleDateString('pl-PL')
                const timeStr = due
                  .toLocaleTimeString('pl-PL')
                  .slice(0, 5)
                return (
                  <View key={task.id} style={styles.card}>
                    <Text style={styles.cardTitle}>
                      {task.title}
                    </Text>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: getPriorityColor(
                            task.priority
                          ),
                        },
                      ]}
                    />
                    <Text style={styles.cardLabel}>
                      {getPriorityLabel(task.priority)}
                    </Text>
                    <Text style={styles.cardDate}>
                      {dateStr} {timeStr}
                    </Text>
                  </View>
                )
              })}
          </ScrollView>
        )}
      </View>

     {/* Section 4: All tasks */}
<View style={styles.section4}>
  <Text style={styles.section4Header}>All tasks</Text>
  {tasksLoading ? (
    <ActivityIndicator />
  ) : (
    tasks.map((task) => {
      let IconComponent: React.ComponentType<any>
      let iconName: string
      let iconColor: string

      switch (task.taskStatus) {
        case 'IN_PROGRESS':
          IconComponent = require('@expo/vector-icons/MaterialCommunityIcons')
            .default
          iconName = 'progress-clock'
          iconColor = '#1e88e5'    // blue
          break

        case 'DONE':
        case 'COMPLETED':
          IconComponent = MaterialIcons
          iconName = 'done'
          iconColor = '#4caf50'    // green
          break

        case 'ON_HOLD':
          IconComponent = require('@expo/vector-icons/AntDesign').default
          iconName = 'pausecircleo'
          iconColor = '#fb8c00'    // orange
          break

        case 'CANCELED':
          IconComponent = MaterialIcons
          iconName = 'cancel'
          iconColor = '#e53935'    // red
          break

        case 'NEW':
          IconComponent = require('@expo/vector-icons/Entypo').default
          iconName = 'new'
          iconColor = '#8e24aa'    // purple
          break

        default:
          IconComponent = MaterialIcons
          iconName = 'help-outline'
          iconColor = '#666'       // gray
      }

      return (
        <View key={task.id} style={styles.taskItem}>
          <View style={styles.taskInfo}>
            <IconComponent
              name={iconName}
              size={24}
              color={iconColor}
            />
            <Text style={styles.taskText}>{task.title}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TaskDetails', { id: task.id })
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="more-vert" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )
    })
  )}
</View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f8f0fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section1: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fcfcfc',
    borderRadius: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section2: {
    width: '100%',
    backgroundColor: '#a087f5',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  section3: {
    width: '100%',
    backgroundColor: '#fcfcfc',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardsContainer: {
    paddingLeft: 16,
  },
  card: {
    width: 180,
    backgroundColor: '#a087f5',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#eee',
  },
  section4: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    borderRadius: 8,
    padding: 16,
  },
  section4Header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f0fa',
    borderRadius: 8,
    height: 80,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    marginLeft: 12,
    fontSize: 16,
  },
})
