import { EnvironmentConfig } from '../environments';

export interface SDKConfig {
  env: EnvironmentConfig;
  isTestMode: boolean;
}

export interface TrackingData {
  eventId: string;
  test?: boolean;
  timestamp: number;
  url: string;
  userAgent: string;
  pixelVersion: string;
} 