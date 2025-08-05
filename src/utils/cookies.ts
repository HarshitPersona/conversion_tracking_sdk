/**
 * Cookie utility functions for managing browser cookies
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') {
    return; // Server-side environment
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    const expires = typeof options.expires === 'number' 
      ? new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000)
      : options.expires;
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // Server-side environment
  }

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by setting its expiration date to the past
 */
export function deleteCookie(name: string, path?: string, domain?: string): void {
  setCookie(name, '', {
    expires: new Date(0),
    path,
    domain
  });
}

/**
 * Check if cookies are available in the current environment
 */
export function areCookiesAvailable(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    // Try to set and retrieve a test cookie
    const testName = '__cookie_test__';
    const testValue = 'test';
    setCookie(testName, testValue);
    const retrieved = getCookie(testName);
    deleteCookie(testName);
    return retrieved === testValue;
  } catch {
    return false;
  }
}