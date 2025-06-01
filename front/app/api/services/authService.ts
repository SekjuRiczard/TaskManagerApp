import httpClient from "../httpClient";
import { API_URLS } from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SignupRequest{
    username:string;
    email:string;
    password:string;
}

export interface LoginRequest{
    username:string;
    password:string;
}

export interface JwtResponse{
    token:string,
    type:string;
}

export const register = async (data: SignupRequest): Promise<JwtResponse> => {
    const response = await httpClient.post<JwtResponse>(
      API_URLS.AUTH.REGISTER,
      data
    );
    const jwt = response.data;
    await AsyncStorage.setItem('token', jwt.token);
    return jwt;
  };

  export const login = async (data: LoginRequest): Promise<JwtResponse> => {
    const response = await httpClient.post<JwtResponse>(
      API_URLS.AUTH.LOGIN,
      data
    );
    const jwt = response.data;
    await AsyncStorage.setItem('token', jwt.token);
    return jwt;
  };
  
  export const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('token');
  };
  