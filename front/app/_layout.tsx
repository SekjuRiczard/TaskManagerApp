import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerNavigator from './navigation/DrawerNavigator';
import AuthStack from './navigation/AuthStack';
import { AuthProvider,useAuth } from './context/AuthContext';


function RootNavigator(){
  const { isAuthenticated } = useAuth();
  return isAuthenticated == false ? <AuthStack /> : <DrawerNavigator />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
  </GestureHandlerRootView>
  );
}
