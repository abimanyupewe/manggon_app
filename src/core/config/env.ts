/**
 * Global Environment Configuration
 */

import { Platform } from 'react-native';

const getDefaultApiUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }
  return 'http://localhost:8000/api/v1';
};

export const Env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || getDefaultApiUrl(),
  API_TIMEOUT: 15000,
  APP_NAME: 'Manggon Mobile',
  APP_VERSION: '1.0.0',
} as const;
