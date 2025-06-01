// src/screens/RegisterScreen.tsx
import React, { useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import { register, SignupRequest } from '../api/services/authService'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'

export default function RegisterScreen() {
  const navigation = useNavigation()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    const payload: SignupRequest = { username, email, password }
    try {
      const jwt = await register(payload)
      await signIn(jwt.token)
    } catch (e: any) {
      console.error('Register error', e)
      setError(e.response?.data?.message || 'Coś poszło nie tak')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Register</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Email */}
            <View style={styles.inputGroup}>
              <MaterialIcons
                name="email"
                size={20}
                color="#666"
                style={styles.icon}
              />
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
              <FontAwesome5
                name="user-alt"
                size={20}
                color="#666"
                style={styles.icon}
              />
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <MaterialIcons
                name="vpn-key"
                size={20}
                color="#666"
                style={styles.icon}
              />
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.bottomText}>Already have account?</Text>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={[styles.buttonText, styles.loginButtonText]}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    marginTop: 20,
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
  },
  button: {
    width: '100%',
    backgroundColor: '#a087f5',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomText: {
    marginTop: 24,
    marginBottom: 8,
    color: '#666',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#a087f5',
  },
  loginButtonText: {
    color: '#a087f5',
  },
})
