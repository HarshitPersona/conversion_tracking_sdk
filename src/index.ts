import APIClient from './api';
import ConversionPixelSDK from './core/sdk';
import { ENVIRONMENTS } from './environments';
import { PixelInitConfig } from './types';
import Logger from './utils/logger';
import ConsoleLogHandler from './utils/logger/handlers/ConsoleLogHandler';
import { SDKConfig } from './core/types';
import { initializeSession } from './utils/session';

let sdkInstance: ConversionPixelSDK | null = null;

function initializeSDK(config: PixelInitConfig = {}): ConversionPixelSDK | null {
  const { isTestMode = false, environment = 'production' } = config;

  const logger = new Logger({
    handlers: [new ConsoleLogHandler()],
    metadata: { isTestMode, environment },
  });

  if (!(environment in ENVIRONMENTS)) {
    logger.error({
      message: 'Failed to initialize SDK - Invalid environment',
      extra: { environment }
    });
    return null;
  }

  if (sdkInstance) {
    return sdkInstance;
  }

  const apiClient = new APIClient(ENVIRONMENTS[environment], logger);

  const sdkConfig: SDKConfig = {
    env: ENVIRONMENTS[environment],
    isTestMode,
  };

  sdkInstance = new ConversionPixelSDK(sdkConfig, logger, apiClient);
  return sdkInstance;
}

// Auto-initialize and handle pier39 queue when script loads
(function() {
  if (typeof window === 'undefined') return;
  
  // Initialize session management first - this will set sessionId from URL params to cookie if available
  const sessionId = initializeSession();
  
  if (sessionId) {
    console.log('Session initialized with ID:', sessionId);
  }
  
  // Initialize the SDK
  const sdk = initializeSDK({
    isTestMode: false,
    environment: 'development',
    ...(window as any).Pier39Config || {}
  });
  
  if (!sdk) return;
  
  const w = window as any;
  
  // Process any queued commands
  const queue = w.pier39?.q || [];
  
  // Replace the queue function with the real implementation
  w.pier39 = function(command: string, eventType: string, data: any) {
    if (command === 'track' && eventType && data) {
      sdk.track(eventType, data);
    } else {
      console.warn('Unknown pier39 command:', command);
    }
  };
  
  // Process all queued commands
  queue.forEach((args: any[]) => {
    if (args && args.length > 0) {
      w.pier39(...args);
    }
  });
})();

// Expose global API for direct access
if (typeof window !== 'undefined') {
  (window as any).Pier39ConversionSDK = {
    initializeSDK
  };
}

export * from './types';
export { initializeSDK };
export { getSessionId, setSessionId, initializeSession, clearSession } from './utils/session';

// Default export for UMD compatibility
export default {
  initializeSDK,
}; 