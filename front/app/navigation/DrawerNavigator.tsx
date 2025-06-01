// src/navigation/DrawerNavigator.tsx
import React from 'react'
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import { MaterialIcons } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import HomeScreen from '../screens/HomeScreen'
import DashboardScreen from '../screens/DashboardScreen'
import AccountScreen from '../screens/AccountScreen'
import TaskDetailsScreen from '../screens/TaskDetailsScreen'
import AddTaskScreen from '../screens/AddTaskScreen'
import UpdateTaskScreen from '../screens/UpdateTaskScreen'

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <SafeAreaView>
        {/* Tu wstawiasz swój obrazek */}
        <Image
          source={require('../../assets/images/WelcomeIcon.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </SafeAreaView>

      {/* A poniżej standardowa lista opcji */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: '#fff' },
        drawerActiveBackgroundColor: '#a087f5',
        drawerInactiveBackgroundColor: '#a087f5',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#fff',
        drawerItemStyle: { marginVertical: 4, borderRadius: 8 },
        drawerLabelStyle: { fontWeight: '600', color: '#fff' },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{
          drawerItemStyle: { height: 0, overflow: 'hidden' },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="add-box" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UpdateTask"
        component={UpdateTaskScreen}
        options={{
          drawerItemStyle: { height: 0, overflow: 'hidden' },
          drawerLabel: () => null,
        }}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    paddingTop: 0,    // usuwa domyślny padding
  },
  headerImage: {
    marginTop: 5,
    width: '100%',
    height: 150,
    marginBottom: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
})
