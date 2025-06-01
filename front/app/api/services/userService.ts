import {jwtDecode} from 'jwt-decode';
import { API_URLS } from '../urls';
import httpClient from '../httpClient';

// Jeżeli Twój token ma w payload np. { sub: "123", username: "testuser", ... }

export interface UserResponse {
  id: number;
  username: string;
}

/**
 * Dekoduje token i zwraca id + username.
 * Uwaga: działa tylko jeśli w tokenie masz claim `username`.
 */
export async function getUserData(token: string): Promise<UserResponse> {
    const response = await httpClient.get<UserResponse>(API_URLS.USER.GET_USER_INFO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

