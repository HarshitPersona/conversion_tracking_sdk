/**
 * Session management utilities for handling sessionId from cookies and URL parameters
 */

import { getCookie, setCookie, CookieOptions } from './cookies';
import { getQueryParam } from './url';

export const SESSION_COOKIE_NAME = 'pier39_session_id';
export const SESSION_URL_PARAM = 'sessionId';

export interface SessionConfig {
  cookieName?: string;
  urlParamName?: string;
  cookieOptions?: CookieOptions;
}

/**
 * Default cookie options for session storage
 */
const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  expires: 30, // 30 days
  path: '/',
  sameSite: 'lax'
};

/**
 * Get sessionId from cookie first, then fall back to URL parameter
 */
export function getSessionId(config: SessionConfig = {}): string | null {
  const cookieName = config.cookieName || SESSION_COOKIE_NAME;
  const urlParamName = config.urlParamName || SESSION_URL_PARAM;

  // First, try to get from cookie
  const sessionFromCookie = getCookie(cookieName);
  if (sessionFromCookie) {
    return sessionFromCookie;
  }

  // Fall back to URL parameter
  const sessionFromUrl = getQueryParam(urlParamName);
  return sessionFromUrl;
}

/**
 * Set sessionId in cookie
 */
export function setSessionId(sessionId: string, config: SessionConfig = {}): void {
  const cookieName = config.cookieName || SESSION_COOKIE_NAME;
  const cookieOptions = { ...DEFAULT_COOKIE_OPTIONS, ...config.cookieOptions };

  setCookie(cookieName, sessionId, cookieOptions);
}

/**
 * Initialize session management - get sessionId from URL and set it in cookie if available
 * This should be called when the script loads
 */
export function initializeSession(config: SessionConfig = {}): string | null {
  const urlParamName = config.urlParamName || SESSION_URL_PARAM;
  const cookieName = config.cookieName || SESSION_COOKIE_NAME;

  // Check if sessionId is in URL parameters
  const sessionFromUrl = getQueryParam(urlParamName);
  
  if (sessionFromUrl) {
    // Set it in cookie for future use
    setSessionId(sessionFromUrl, config);
    return sessionFromUrl;
  }

  // If not in URL, try to get from existing cookie
  const sessionFromCookie = getCookie(cookieName);
  return sessionFromCookie;
}

/**
 * Clear session data
 */
export function clearSession(config: SessionConfig = {}): void {
  const cookieName = config.cookieName || SESSION_COOKIE_NAME;
  setCookie(cookieName, '', { expires: new Date(0) });
}

/**
 * Check if a valid session exists
 */
export function hasValidSession(config: SessionConfig = {}): boolean {
  const sessionId = getSessionId(config);
  return sessionId !== null && sessionId.trim().length > 0;
}