import { ConversionEventData } from '../types';
import { SDKConfig, TrackingData } from './types';
import { PIXEL_VERSION, EVENT_TYPES } from '../constants';
import Logger from '../utils/logger';
import APIClient from '../api';
import { getSessionId } from '../utils/session';

class ConversionPixelSDK {
  private readonly isTestMode: boolean;
  private readonly apiClient: APIClient;
  private readonly logger: Logger;

  constructor(config: SDKConfig, logger: Logger, apiClient: APIClient) {
    this.isTestMode = config.isTestMode;
    this.logger = logger;
    this.apiClient = apiClient;
  }

  public async track(eventType: string, data: ConversionEventData): Promise<void> {
    try {
      if (eventType !== EVENT_TYPES.CONVERSION) {
        this.logger.error({
          message: `Invalid event type: ${eventType}`,
          extra: { eventType, data }
        });
        return;
      }

      if (!data.eventId) {
        this.logger.error({
          message: 'Missing required field: eventId',
          extra: { data }
        });
        return;
      }

      const isTestMode = data.test || this.isTestMode;
      const sessionId = isTestMode ? 'test' : getSessionId();
      
      const trackingData: TrackingData = {
        eventId: data.eventId,
        sessionId: sessionId || undefined,
        test: isTestMode,
        pixelVersion: PIXEL_VERSION,
      };

      if (trackingData.test) {
        this.logger.info({
          message: 'Test conversion tracked',
          extra: { trackingData }
        });
        console.log('Test conversion tracked');
      }

      this.logger.info({
        message: 'Tracking conversion event',
        extra: { trackingData }
      });

      await this.apiClient.trackConversion(trackingData);

      this.logger.info({
        message: 'Conversion event tracked successfully',
        extra: { eventId: trackingData.eventId }
      });

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error({
        message: 'Failed to track conversion',
        extra: { eventType, data },
        error: err,
      });
      
      // Silently fail for better user experience
      // Could implement retry logic here if needed
    }
  }
}

export type { ConversionPixelSDK };
export default ConversionPixelSDK; 