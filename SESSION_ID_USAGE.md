# SessionId Tracking Implementation

The Pier39 Conversion Tracking SDK now includes automatic sessionId tracking functionality. This document explains how it works and how to use it.

## Overview

The SDK automatically tracks sessionId from two sources (in order of priority):
1. **Cookie** (`pier39_session_id`) - Primary source
2. **URL Query Parameter** (`sessionId`) - Fallback source

When the script loads, it automatically:
- Checks for `sessionId` in the URL query parameters
- If found, sets it in a cookie for future page views
- Uses the sessionId (from cookie or URL) in all conversion tracking events

## How It Works

### Automatic Initialization
```javascript
// When the SDK script loads, it automatically:
// 1. Looks for ?sessionId=abc123 in the URL
// 2. Sets pier39_session_id=abc123 cookie (expires in 30 days)
// 3. Uses this sessionId in all subsequent conversion tracking
```

### SessionId in Conversion Tracking
```javascript
// When you track a conversion:
pier39('track', 'conversion', {
    eventId: 'purchase_123'
});

// The SDK automatically includes sessionId in the API payload:
{
    eventId: 'purchase_123',
    sessionId: 'abc123',  // ← Automatically added
    timestamp: 1699123456789,
    url: 'https://example.com',
    userAgent: '...',
    pixelVersion: '1.0.0'
}
```

## Usage Examples

### Basic Usage (Automatic)
No code changes needed! The SDK handles everything automatically.

```html
<!-- User visits with sessionId in URL -->
<script>
    // This automatically sets sessionId cookie and uses it for tracking
    window.location = 'https://yoursite.com/page?sessionId=user_session_123';
</script>

<!-- Later, when user converts -->
<script>
    pier39('track', 'conversion', {
        eventId: 'purchase_456'
    });
    // sessionId is automatically included from cookie
</script>
```

### Manual SessionId Management
If you need manual control:

```javascript
import { getSessionId, setSessionId, clearSession } from './path/to/sdk';

// Get current sessionId
const currentSession = getSessionId();
console.log('Current session:', currentSession);

// Set a new sessionId
setSessionId('my_custom_session_id');

// Clear session
clearSession();
```

## Configuration

### Default Settings
- **Cookie Name**: `pier39_session_id`
- **URL Parameter**: `sessionId`
- **Cookie Expiry**: 30 days
- **Cookie Path**: `/`
- **Cookie SameSite**: `lax`

### Custom Configuration
```javascript
import { initializeSession, getSessionId } from './path/to/sdk';

// Custom configuration
const config = {
    cookieName: 'my_session_cookie',
    urlParamName: 'sid',
    cookieOptions: {
        expires: 7, // 7 days instead of 30
        domain: '.example.com',
        secure: true
    }
};

// Initialize with custom config
const sessionId = initializeSession(config);

// Use custom config for getting sessionId
const currentSession = getSessionId(config);
```

## Testing SessionId Functionality

### Test with URL Parameter
1. Visit your page with sessionId: `https://yoursite.com?sessionId=test123`
2. Check browser developer tools → Application → Cookies
3. Verify `pier39_session_id=test123` cookie is set
4. Trigger a conversion and check the API payload includes `sessionId: "test123"`

### Test Cookie Persistence
1. Set sessionId via URL parameter
2. Navigate to another page (without sessionId in URL)
3. Trigger conversion - should still include sessionId from cookie

### Demo Page Testing
The test page at `/public/index.html` now displays:
- Current sessionId from URL parameter
- Current sessionId from cookie
- Both values are shown on page load

## API Changes

### TrackingData Interface
```typescript
interface TrackingData {
    eventId: string;
    sessionId?: string;  // ← New optional field
    test?: boolean;
    timestamp: number;
    url: string;
    userAgent: string;
    pixelVersion: string;
}
```

### New Utility Functions
```typescript
// Get sessionId (cookie first, then URL parameter)
function getSessionId(config?: SessionConfig): string | null;

// Set sessionId in cookie
function setSessionId(sessionId: string, config?: SessionConfig): void;

// Initialize session (get from URL, set in cookie)
function initializeSession(config?: SessionConfig): string | null;

// Clear session data
function clearSession(config?: SessionConfig): void;

// Check if valid session exists
function hasValidSession(config?: SessionConfig): boolean;
```

## Browser Compatibility

- **Cookies**: Supported in all browsers
- **URLSearchParams**: IE 10+, all modern browsers
- **URL Constructor**: IE 10+, all modern browsers
- **Fallback**: Manual cookie parsing for edge cases

## Privacy Considerations

- SessionId is stored in browser cookies (first-party)
- Default expiry: 30 days
- No personally identifiable information is collected
- Respects browser cookie settings and user preferences
- SameSite=lax provides CSRF protection while allowing cross-site navigation

## Troubleshooting

### SessionId Not Being Set
1. Check if cookies are enabled in the browser
2. Verify the URL parameter name matches (default: `sessionId`)
3. Check browser console for any JavaScript errors

### SessionId Not Included in Tracking
1. Verify sessionId exists in cookie or URL
2. Check if cookie domain/path settings are correct
3. Ensure the tracking code runs after SDK initialization

### Cookie Not Persisting
1. Check cookie expiry settings
2. Verify domain/path configuration
3. Ensure HTTPS for secure cookies (if secure flag is set)