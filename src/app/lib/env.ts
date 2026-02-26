/**
 * Environment configuration for production
 * This file handles environment-specific settings
 */

export const ENV = {
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.sansekai.my.id/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  
  // Feature Flags
  ENABLE_CACHE: import.meta.env.VITE_ENABLE_CACHE !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  
  // App Info
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_NAME: 'Teras Dracin',
} as const;

// Validate required environment variables
export function validateEnv(): void {
  const required = [];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}

// Log environment info in development
if (ENV.isDevelopment) {
  console.log('🌍 Environment:', {
    mode: import.meta.env.MODE,
    isDev: ENV.isDevelopment,
    isProd: ENV.isProduction,
    apiUrl: ENV.API_BASE_URL,
    cacheEnabled: ENV.ENABLE_CACHE,
  });
}
