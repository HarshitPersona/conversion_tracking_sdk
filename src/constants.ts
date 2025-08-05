export const PIXEL_VERSION = '1.0.0';
export const PIXEL_NAME = 'pier39-conversion-pixel';

export const DEFAULT_TIMEOUT = 5000; // 5 seconds
export const MAX_RETRIES = 3;

export const EVENT_TYPES = {
  CONVERSION: 'conversion',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES]; 