import { EnvironmentConfig } from '../environments';

export interface SDKConfig {
  env: EnvironmentConfig;
  isTestMode: boolean;
}

export interface TrackingData {
  eventId: string;
  sessionId?: string;
  test?: boolean;
  pixelVersion: string;
} 