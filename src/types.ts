import type { ConversionPixelSDK } from './core/sdk';

export type Environment = 'production' | 'staging' | 'development';

export interface PixelInitConfig {
  eventId?: string;
  isTestMode?: boolean;
  environment?: Environment;
}

export interface ConversionEventData {
  eventId: string;
  test?: boolean;
  timestamp?: number;
  url?: string;
  userAgent?: string;
}

export type { ConversionPixelSDK };

declare global {
  interface Window {
    Pier39PixelObject: string;
    pier39: {
      (...args: any[]): void;
      q?: any[];
    };
    Pier39ConversionSDK: {
      initializeSDK: (config?: PixelInitConfig) => ConversionPixelSDK | null;
    };
  }
} 