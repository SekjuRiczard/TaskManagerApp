import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const BASE_URL = "http://192.168.1.170:8080";

const httpClient = axios.create({
    baseURL:BASE_URL, 
    timeout:10000,
    headers:{
        'Content-Type':'application/json',
    },
});

httpClient.interceptors.request.use(async config=>{
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

httpClient.interceptors.response.use(
    response => response,
    error => {
      // Obsługa błędów globalnie
      // np. przekierowanie na ekran logowania przy 401
      return Promise.reject(error);
    }
  );

export default httpClient;