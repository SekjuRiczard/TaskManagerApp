// src/screens/TaskDetailsScreen.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import {
  getTaskById,
  deleteTask,
  TaskResponse,
} from '../api/services/taskService'

type RootStackParamList = {
  TaskDetails: { id: number }
}

type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>

export default function TaskDetailsScreen() {
  const route = useRoute<TaskDetailsRouteProp>()
  const navigation = useNavigation()
  const { id } = route.params

  const [task, setTask] = useState<TaskResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadTask = async () => {
      try {
        const data = await getTaskById(id)
        setTask(data)
      } catch {
        Alert.alert('Error', 'Could not load task details')
      } finally {
        setLoading(false)
      }
    }
    loadTask()
  }, [id])

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true)
            try {
              await deleteTask(id)
              Alert.alert('Deleted', 'Task has been deleted')
              navigation.goBack()
            } catch {
              Alert.alert('Error', 'Could not delete task')
            } finally {
              setDeleting(false)
            }
          },
        },
      ]
    )
  }

  const handleUpdate = () => {
    navigation.navigate('UpdateTask', { id })
  }

  if (loading) {
    return (
      <View style={[styles.center, styles.container]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!task) {
    return (
      <View style={[styles.center, styles.container]}>
        <Text style={styles.errorText}>Task not found.</Text>
      </View>
    )
  }

  const formattedDue = new Date(task.dueDate).toLocaleString('pl-PL', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <View style={styles.card}>
        <MaterialIcons
          name="title"
          size={24}
          color="#a087f5"
          style={styles.icon}
        />
        <Text style={styles.cardHeader}>Title</Text>
        <Text style={styles.cardValue}>{task.title}</Text>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <MaterialIcons
          name="description"
          size={24}
          color="#a087f5"
          style={styles.icon}
        />
        <Text style={styles.cardHeader}>Description</Text>
        <Text style={styles.cardValue}>{task.description || '—'}</Text>
      </View>

      {/* Status & Priority */}
      <View style={styles.card}>
        <MaterialIcons
          name="info"
          size={24}
          color="#a087f5"
          style={styles.icon}
        />
        <Text style={styles.cardHeader}>Status & Priority</Text>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.subHeader}>Status</Text>
            <Text style={styles.cardValue}>{task.taskStatus}</Text>
          </View>
          <View style={styles.half}>
            <Text style={styles.subHeader}>Priority</Text>
            <Text style={styles.cardValue}>{task.priority}</Text>
          </View>
        </View>
      </View>

      {/* Due Date */}
      <View style={styles.card}>
        <MaterialIcons
          name="calendar-today"
          size={24}
          color="#a087f5"
          style={styles.icon}
        />
        <Text style={styles.cardHeader}>Due Date</Text>
        <Text style={styles.cardValue}>{formattedDue}</Text>
      </View>

      {/* Assigned To */}
      <View style={styles.card}>
        <MaterialIcons
          name="person"
          size={24}
          color="#a087f5"
          style={styles.icon}
        />
        <Text style={styles.cardHeader}>Assigned To</Text>
        <Text style={styles.cardValue}>User ID: {task.userId}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={handleUpdate}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deleting}
        >
          <MaterialIcons name="delete" size={18} color="#fff" />
          <Text style={styles.buttonText}>{deleting ? 'Deleting…' : 'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fcfcfc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  updateButton: {
    backgroundColor: '#a087f5',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
})
