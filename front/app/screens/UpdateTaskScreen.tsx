// src/screens/UpdateTaskScreen.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { getTaskById, updateTask, TaskRequest, TaskResponse } from '../api/services/taskService'
import dayjs from 'dayjs'

// Define route params type
type RootStackParamList = {
  UpdateTask: { id: number }
}

type UpdateRouteProp = RouteProp<RootStackParamList, 'UpdateTask'>

export default function UpdateTaskScreen() {
  const navigation = useNavigation()
  const route = useRoute<UpdateRouteProp>()
  const taskId = route.params.id

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [status, setStatus] = useState<'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELED'>('NEW')
  const [priority, setPriority] = useState<string>('1')
  const [dueDate, setDueDate] = useState<Date>(new Date())
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  // Load existing task data
  useEffect(() => {
    async function fetchTask() {
      try {
        const task: TaskResponse = await getTaskById(taskId)
        setTitle(task.title)
        setDescription(task.description || '')
        setStatus(task.taskStatus as any)
        setPriority(task.priority.toString())
        setDueDate(new Date(task.dueDate))
      } catch (err) {
        console.error('[UpdateTask] fetch error:', err)
        Alert.alert('Error', 'Could not load task data')
        navigation.goBack()
      } finally {
        setInitialLoading(false)
      }
    }
    fetchTask()
  }, [taskId])

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required')
      return
    }
    setLoading(true)
    const iso = dayjs(dueDate).toISOString()
    const taskPayload: TaskRequest = {
      title,
      description,
      status,
      priority: Number(priority),
      dueDate: iso,
    }

    try {
      console.log('[UpdateTask] updating task:', taskPayload)
      await updateTask(taskId, taskPayload)
      Alert.alert('Success', 'Task updated')
      navigation.goBack()
    } catch (error) {
      console.error('[UpdateTask] error:', error)
      Alert.alert('Error', 'Could not update task')
    } finally {
      setLoading(false)
    }
  }

  const onChangeDate = (_: any, selected?: Date) => {
    setShowPicker(false)
    if (selected) setDueDate(selected)
  }

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a087f5" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Update Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Task description"
        placeholderTextColor="#999"
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={status} onValueChange={(val) => setStatus(val as any)}>
          <Picker.Item label="New" value="NEW" />
          <Picker.Item label="In Progress" value="IN_PROGRESS" />
          <Picker.Item label="Completed" value="COMPLETED" />
          <Picker.Item label="On Hold" value="ON_HOLD" />
          <Picker.Item label="Canceled" value="CANCELED" />
        </Picker>
      </View>

      <Text style={styles.label}>Priority (1-5)</Text>
      <TextInput
        style={styles.input}
        value={priority}
        onChangeText={setPriority}
        placeholder="1"
        placeholderTextColor="#999"
        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
      />

      <Text style={styles.label}>Due Date</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {dayjs(dueDate).format('YYYY/MM/DD HH:mm')}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={dueDate}
          mode="datetime"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Task</Text>}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a087f5',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#a087f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#a087f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#a087f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#a087f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#d3bdfc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
