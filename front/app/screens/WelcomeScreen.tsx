import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();

  // Optional: you can track a local "checking" state if needed
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // When auth context updates, we know check is done
    setChecking(false);
  }, [isAuthenticated]);

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };
  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/WelcomeIcon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Hello!</Text>
      <Text style={styles.slogan}>Your day, your tasks—own them.</Text>

      {checking ? (
        <TouchableOpacity style={styles.button} disabled>
          <ActivityIndicator color="#fff" />
        </TouchableOpacity>
      ) : !isAuthenticated ? (
        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
            <Text style={styles.authText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authButton} onPress={handleRegister}>
            <Text style={styles.authText}>Register</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a087f5', // główny kolor tła
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  slogan: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6e5bd2', // ciemniejszy odcień fioletu
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    marginTop: 30,
  },
  authButton: {
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  authText: {
    color: '#a087f5',
    fontWeight: 'bold',
  },
});
