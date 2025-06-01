// components/TaskProgressCard.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress'

type Props = {
  tasksCompleted: number
  tasksTotal:     number
  title?:         string
}

const TaskProgressCard: React.FC<Props> = ({
  tasksCompleted,
  tasksTotal,
  title = 'Task Progress',
}) => {
  const progress = tasksTotal > 0 ? tasksCompleted / tasksTotal : 0

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {tasksCompleted} z {tasksTotal} wykonane
        </Text>
      </View>
      <Progress.Circle
        size={120}
        progress={progress}
        style={styles.progress}
        showsText
        formatText={() => `${Math.round(progress * 100)}%`}
        thickness={6}
        color="#fff"
        unfilledColor="rgba(255,255,255,0.3)"
        borderWidth={0}
      />
    </View>
  )
}

export default TaskProgressCard

const styles = StyleSheet.create({
  card: {
    width: '100%',              // konkretna szerokość
    height: 180,    
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'flex-start',
    backgroundColor:  '#a087f5',  // możesz zmienić na swój
    borderRadius:     12,
  },
  info: {
    flex:        1,
    paddingLeft: 22,
  },
  progress: {
      marginRight: 30,   // przesunięcie koła o 20px w lewo
    },
  title: {
    color:      '#fff',
    fontSize:   25,
    fontWeight: '600',
  },
  subtitle: {
    color:     'rgba(255,255,255,0.8)',
    fontSize:   16,
    marginTop: 4,
  },
})
