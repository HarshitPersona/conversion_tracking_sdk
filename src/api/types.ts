import { TrackingData } from '../core/types';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  errors?: Record<string, string>;
}

export interface TrackConversionRequest extends TrackingData {}

export interface TrackConversionResponse {
  tracked: boolean;
  eventId: string;
  timestamp: number;
} 