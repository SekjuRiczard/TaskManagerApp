// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserData, UserResponse} from '../api/services/userService';

// Typ zwracanego profilu użytkownika
// powinien pasować do UserProfileDto z backendu
export interface UserProfile extends UserResponse {}

type AuthContextType = {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken]             = useState<string | null>(null)
  const [user, setUser]               = useState<UserProfile | null>(null)
  const [isAuthenticated, setAuth]    = useState(false)
  const [isLoading, setLoading]       = useState(true)

  // Bootstrap: load saved token and user profile
  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = await AsyncStorage.getItem('token')
      if (savedToken) {
        setToken(savedToken)
        setAuth(true)
        try {
          const profile = await getUserData(savedToken)
          setUser(profile)
        } catch {
          // token invalid or fetch failed
          await AsyncStorage.removeItem('token')
          setToken(null)
          setAuth(false)
          setUser(null)
        }
      }
      setLoading(false)
    }
    bootstrap()
  }, [])

  // signIn: save token, fetch profile via service
  const signIn = async (newToken: string) => {
    await AsyncStorage.setItem('token', newToken)
    setToken(newToken)
    setAuth(true)
    const profile = await getUserData(newToken)
    setUser(profile)
  }

  // signOut: clear storage and state
  const signOut = async () => {
    await AsyncStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setAuth(false)
  }

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
