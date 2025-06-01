// src/screens/StatsScreen.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native'
import {
  PieChart,
  BarChart,
  LineChart,
} from 'react-native-chart-kit'

import {
  getTaskStatusStats,
  getTaskPriorityStats,
  getNewTasksStats,
} from '../api/services/taskService'
import {
  TaskStatusStats,
  TaskPriorityStats,
  NewTasksStats,
} from '../api/services/taskService'

export default function DashboardScreen() {
  const screenWidth = Dimensions.get('window').width - 32
  const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  // Loading states and API data
  const [statusStats, setStatusStats]     = useState<TaskStatusStats[]>([])
  const [priorityStats, setPriorityStats] = useState<TaskPriorityStats[]>([])
  const [newTasksStats, setNewTasksStats] = useState<NewTasksStats[]>([])

  useEffect(() => {
    console.log('🟢 DashboardScreen mounted, starting data fetch…')

    ;(async () => {
      try {
        console.log('fetching status…')
        const statusData = await getTaskStatusStats()
        console.log('✔ statusData:', statusData)
        setStatusStats(statusData)

        console.log('fetching priority…')
        const priorityData = await getTaskPriorityStats()
        console.log('✔ priorityData:', priorityData)
        setPriorityStats(priorityData)

        console.log('fetching new tasks…')
        const newTasksData = await getNewTasksStats()
        console.log('✔ newTasksData:', newTasksData)
        setNewTasksStats(newTasksData)
      } catch (err) {
        console.error('❌ Error fetching stats:', err)
      }
    })()
  }, [])

  // Prepare chart data
  const pieData = statusStats.map((s, i) => ({
    name: s.name.replace('_', ' '),
    count: s.count,
    color: ['#42a5f5','#ffa726','#66bb6a','#ab47bc','#ef5350'][i % 5],
    legendFontColor: '#333',
    legendFontSize: 14,
  }))

  const barData = {
    labels: priorityStats.map(p => p.name),
    datasets: [{ data: priorityStats.map(p => p.count) }],
  }

  const lineData = {
    labels: weekDays,
    datasets: [{
      data: weekDays.map(d => {
        const entry = newTasksStats.find(x => x.day === d)
        return entry ? entry.count : 0
      }),
      strokeWidth: 2
    }]
  }

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: () => `rgba(160, 135, 245, 0.9)`,
    labelColor: () => `#666`,
    style: { borderRadius: 12 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#a087f5' },
    barPercentage: 0.6,
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🔍 Task Statistics</Text>
      <Text style={styles.subheader}>
        Here you can see key metrics for your tasks.
      </Text>

      {/* Status Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Distribution</Text>
        <Text style={styles.cardDesc}>
          Percentage of tasks by status.
        </Text>
        <PieChart
          data={pieData}
          width={screenWidth}
          height={180}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="8"
          absolute
        />
      </View>

      {/* Priority Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Priority Breakdown</Text>
        <Text style={styles.cardDesc}>
          Number of tasks grouped by priority (1–4).
        </Text>
        <BarChart
          data={barData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          fromZero
          style={{ marginTop: 8 }}
        />
      </View>

      {/* New Tasks Trend */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>New Tasks (Last 7 Days)</Text>
        <Text style={styles.cardDesc}>
          Trend of tasks created over the past week.
        </Text>
        <LineChart
          data={lineData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={{ marginTop: 8, marginRight: 25 }}
        />
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f8',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
})
