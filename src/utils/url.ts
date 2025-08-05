/**
 * URL utility functions for parsing query parameters
 */

/**
 * Parse URL query parameters from a URL string or current location
 */
export function parseQueryParams(url?: string): Record<string, string> {
  const queryString = url ? new URL(url).search : (typeof window !== 'undefined' ? window.location.search : '');
  
  if (!queryString) {
    return {};
  }

  const params: Record<string, string> = {};
  const urlParams = new URLSearchParams(queryString);

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Get a specific query parameter value by name
 */
export function getQueryParam(name: string, url?: string): string | null {
  const params = parseQueryParams(url);
  return params[name] || null;
}

/**
 * Check if a query parameter exists
 */
export function hasQueryParam(name: string, url?: string): boolean {
  return getQueryParam(name, url) !== null;
}

/**
 * Get the current page URL
 */
export function getCurrentUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.location.href;
}

/**
 * Remove query parameters from a URL
 */
export function removeQueryParams(url: string, paramsToRemove: string[]): string {
  try {
    const urlObj = new URL(url);
    paramsToRemove.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    return urlObj.toString();
  } catch {
    return url; // Return original if URL parsing fails
  }
}