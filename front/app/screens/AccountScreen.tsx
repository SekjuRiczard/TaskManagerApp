// src/screens/AccountScreen.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { MaterialIcons } from '@expo/vector-icons'
import { Calendar } from 'react-native-calendars' // add calendar component
import { BarChart } from 'react-native-chart-kit'

// remove screenWidth and chart import above

export default function AccountScreen() {
  const { user, signOut } = useAuth()
  const navigation         = useNavigation()

  const handleLogout = async () => {
    await signOut()
  }

  const handleAddTask = () => {
    navigation.navigate('AddTask')
  }

  // Dummy chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [3, 6, 2, 10, 5]
      }
    ]
  }

  return (
    <View style={styles.container}>
      {/* Icon at top */}
      <MaterialIcons name="account-circle" size={80} color="#a087f5" style={styles.icon} />

      <View style={styles.card}>
        <Text style={styles.title}>Account Info</Text>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user?.username}</Text>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user?.id}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>+ Add New Task</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#a087f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#f8f0fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  chart: {
    borderRadius: 8,
  },
  addButton: {
    width: '100%',
    backgroundColor: '#a087f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#a087f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#a087f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
