# 🍪 Cookie-Based Authentication Setup

## Overview

The authentication system now uses **HTTP cookies** for storing access and refresh tokens, providing better security compared to localStorage.

## Architecture

### Storage Strategy

| Data Type         | Storage Location | Expiry     | Purpose            |
| ----------------- | ---------------- | ---------- | ------------------ |
| **Access Token**  | Cookie           | 15 minutes | API authentication |
| **Refresh Token** | Cookie           | 7 days     | Token renewal      |
| **User Data**     | LocalStorage     | -          | User profile info  |

### Why Cookies for Tokens?

✅ **Better Security**: Cookies can be configured with security flags
✅ **Automatic Expiry**: Built-in expiration management
✅ **CSRF Protection**: SameSite attribute prevents cross-site attacks
✅ **HTTPS Only**: Secure flag ensures transmission over HTTPS only

## Cookie Configuration

### Security Features

```javascript
{
  secure: true,        // Only sent over HTTPS
  sameSite: 'Strict',  // Prevents CSRF attacks
  path: '/',           // Available site-wide
  expires: <date>      // Auto-deletion after expiry
}
```

### Token Expiration

- **Access Token**: 15 minutes (short-lived for security)
- **Refresh Token**: 7 days (allows persistent sessions)

## File Structure

```
src/
├── utils/
│   ├── cookies.js        # Cookie management utilities
│   └── storage.js        # Token & user storage layer
├── features/
│   └── auth/
│       ├── authSlice.js  # Redux state management
│       ├── authAPI.js    # API calls
│       └── hooks.js      # React hooks
└── App.jsx              # Auth restoration on load
```

## Implementation Details

### 1. Cookie Utilities (`utils/cookies.js`)

```javascript
setCookie(name, value, days, options);
getCookie(name);
removeCookie(name, options);
checkCookie(name);
```

### 2. Storage Layer (`utils/storage.js`)

**Token Management (Cookies)**:

- `getToken()` / `setToken(token)` / `removeToken()`
- `getRefreshToken()` / `setRefreshToken(token)` / `removeRefreshToken()`

**User Management (LocalStorage)**:

- `getUser()` / `setUser(user)` / `removeUser()`

**Clear All**:

- `clearAuthData()` - Removes all authentication data

### 3. Redux Integration (`authSlice.js`)

Automatically saves tokens to cookies on:

- ✅ Login success
- ✅ Registration success
- ✅ Token refresh

Automatically removes tokens on:

- ❌ Logout
- ❌ clearAuth action

### 4. Auto-Restoration (`App.jsx`)

On app initialization:

1. Reads token from cookies
2. Reads user data from localStorage
3. Restores Redux auth state if both exist

## Usage Examples

### Login Flow

```javascript
// User logs in
dispatch(loginAPI({ email, password }))
  ↓
// authSlice saves to cookies automatically
setToken(accessToken)
setRefreshToken(refreshToken)
setUser(userData)
  ↓
// Cookies are now set with security flags
```

### Auto-Login on Page Refresh

```javascript
// App loads
useEffect(() => {
  const token = getToken(); // Read from cookie
  const user = getUser(); // Read from localStorage

  if (token && user) {
    dispatch(restoreAuth({ token, user }));
  }
}, []);
```

### Logout Flow

```javascript
// User logs out
dispatch(logoutAPI())
  ↓
// authSlice clears everything
removeToken()
removeRefreshToken()
removeUser()
  ↓
// All auth data is cleared
```

## Security Considerations

### ⚠️ Important Notes

1. **HTTPS Required**: The `secure` flag is set to `true`, cookies will only be sent over HTTPS in production
2. **CSRF Protection**: `SameSite: Strict` prevents cross-site request forgery
3. **XSS Mitigation**: While we can't set `httpOnly` from client-side JavaScript, sensitive operations should always verify tokens server-side
4. **Token Expiry**: Access tokens expire quickly (15 min) to limit exposure window

### Production Checklist

- [ ] Ensure your site uses HTTPS
- [ ] Configure CORS properly on your backend
- [ ] Implement token refresh flow before access token expiry
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Monitor for suspicious login attempts

## Token Refresh Flow

```javascript
// When access token expires (after 15 minutes)
const refreshToken = getRefreshToken()

dispatch(refreshTokenAPI(refreshToken))
  ↓
// New tokens are saved automatically
setToken(newAccessToken)
setRefreshToken(newRefreshToken)
```

## Debugging

### Check Cookies in Browser

1. Open DevTools → Application/Storage
2. Navigate to Cookies → `http://localhost:5173`
3. Look for:
   - `auth_token` (access token)
   - `auth_refresh_token` (refresh token)

### Common Issues

**Cookies not being set?**

- Check if domain/path matches
- Verify HTTPS for secure flag
- Check browser cookie settings

**Cookies disappearing?**

- Check expiration time
- Verify browser isn't blocking third-party cookies
- Ensure cookies aren't being cleared by extensions

## Migration from localStorage

If you were previously using localStorage for tokens:

1. Old data will remain in localStorage but won't be used
2. New logins will use cookies
3. Users will need to re-login once
4. Old localStorage data can be cleared with:
   ```javascript
   localStorage.removeItem('auth_token');
   ```

## Future Enhancements

- [ ] Implement automatic token refresh before expiry
- [ ] Add "Remember Me" functionality with longer cookie expiry
- [ ] Implement token rotation for refresh tokens
- [ ] Add device/session management
- [ ] Implement multi-tab synchronization

---

**Last Updated**: April 22, 2026
**Status**: ✅ Production Ready
