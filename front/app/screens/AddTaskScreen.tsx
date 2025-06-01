// src/screens/AddTaskScreen.tsx
import React, { useState } from 'react'
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
import { useNavigation } from '@react-navigation/native'
import { addTask , TaskRequest } from '../api/services/taskService'
import dayjs from 'dayjs'

export default function AddTaskScreen() {
  const navigation = useNavigation()
  const [title, setTitle]         = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus]       = useState<'TODO'|'IN_PROGRESS'|'DONE'>('TODO')
  const [priority, setPriority]   = useState('1')
  const [dueDate, setDueDate]     = useState<Date>(new Date())
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading]     = useState(false)

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required')
      return
    }
    setLoading(true)
    const iso = dayjs(dueDate).format('YYYY-MM-DDTHH:mm:ss')
    const task: TaskRequest = {
      title,
      description,
      status,
      priority: Number(priority),
      dueDate: iso,
    }
    try {
      console.log('[AddTask] creating task:', task)
      const created = await addTask(task)
      console.log('[AddTask] created:', created)
      Alert.alert('Success', 'Task added')
      navigation.goBack()
    } catch (error) {
      console.error('[AddTask] error:', error)
      Alert.alert('Error', 'Could not add task')
    } finally {
      setLoading(false)
    }
  }

  const onChangeDate = (_: any, selected?: Date) => {
    setShowPicker(false)
    if (selected) {
      setDueDate(selected)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Add New Task</Text>

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
        <Picker
          selectedValue={status}
          onValueChange={(val) => setStatus(val as any)}
        >
          <Picker.Item label="completed"        value="COMPLETED" />
          <Picker.Item label="In Progress"  value="IN_PROGRESS" />
          <Picker.Item label="On hold"  value="ON_HOLD" />
          <Picker.Item label="Canceled"  value="CANCELED" />
          <Picker.Item label="New "  value="NEW" />
        </Picker>
      </View>

      <Text style={styles.label}>Priority (1-4)</Text>
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
          {dayjs(dueDate).format('YYYY/MM/DD')}{' '}
          {dayjs(dueDate).format('HH:mm')}
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
        onPress={handleAdd}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Add Task</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
