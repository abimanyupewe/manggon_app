/**
 * Secure Token Storage Manager
 * Hardware-level encrypted token storage using expo-secure-store (Keychain/Keystore)
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'manggon_sanctum_token',
  TEMP_TOKEN: 'manggon_temporary_token',
} as const;

export class TokenStorage {
  /**
   * Save permanent Sanctum Bearer token
   */
  static async setAuthToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        return;
      }
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('Failed to save auth token securely:', error);
      throw error;
    }
  }

  /**
   * Get permanent Sanctum Bearer token
   */
  static async getAuthToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to get auth token securely:', error);
      return null;
    }
  }

  /**
   * Remove permanent Sanctum Bearer token
   */
  static async removeAuthToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        return;
      }
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Failed to remove auth token securely:', error);
    }
  }

  /**
   * Save temporary token for force password change flow
   */
  static async setTempToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(STORAGE_KEYS.TEMP_TOKEN, token);
        return;
      }
      await SecureStore.setItemAsync(STORAGE_KEYS.TEMP_TOKEN, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('Failed to save temporary token securely:', error);
    }
  }

  /**
   * Get temporary token
   */
  static async getTempToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(STORAGE_KEYS.TEMP_TOKEN);
      }
      return await SecureStore.getItemAsync(STORAGE_KEYS.TEMP_TOKEN);
    } catch (error) {
      console.error('Failed to get temporary token securely:', error);
      return null;
    }
  }

  /**
   * Remove temporary token
   */
  static async removeTempToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(STORAGE_KEYS.TEMP_TOKEN);
        return;
      }
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TEMP_TOKEN);
    } catch (error) {
      console.error('Failed to remove temporary token securely:', error);
    }
  }

  /**
   * Clear all stored session tokens
   */
  static async clearAllTokens(): Promise<void> {
    await Promise.all([this.removeAuthToken(), this.removeTempToken()]);
  }
}
