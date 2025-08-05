import {
  ApiResponse,
  TrackConversionRequest,
  TrackConversionResponse,
} from './types';
import { TrackingData } from '../core/types';
import Logger from '../utils/logger';
import { EnvironmentConfig } from '../environments';
import { DEFAULT_TIMEOUT, MAX_RETRIES } from '../constants';

class APIClient {
  private readonly env: EnvironmentConfig;
  private readonly logger: Logger;

  constructor(env: EnvironmentConfig, logger: Logger) {
    this.env = env;
    this.logger = logger;
  }

  private async handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success || result.data === null) {
      const errorMessage = result.errors
        ? Object.values(result.errors).join(', ')
        : result.message || 'Something went wrong';
      throw new Error(`API Error: ${errorMessage}`);
    }

    return result.data;
  }

  private async makeRequest<T>(
    url: string,
    payload: any,
    retryCount = 0
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleApiResponse<T>(response);
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        this.logger.warn({
          message: `Request failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`,
          extra: { url, retryCount, error: error instanceof Error ? error.message : String(error) }
        });
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.makeRequest<T>(url, payload, retryCount + 1);
      }
      throw error;
    }
  }

  async trackConversion(trackingData: TrackingData): Promise<TrackConversionResponse> {
    try {
      const url = this.env.BASE_TRACKING_URL;
      
      this.logger.info({
        message: 'Sending conversion tracking request',
        extra: { url, eventId: trackingData.eventId }
      });

      const payload: TrackConversionRequest = trackingData;
      const response = await this.makeRequest<TrackConversionResponse>(url, payload);

      this.logger.info({
        message: 'Conversion tracking request successful',
        extra: { eventId: trackingData.eventId, response }
      });

      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error({
        message: `API error: TrackConversion - ${error.message}`,
        extra: { trackingData },
        error,
      });
      throw error;
    }
  }
}

export default APIClient; 