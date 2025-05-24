# Google OAuth Setup for Spotto Production Deployment

This guide will help you configure Google OAuth to work with your production deployment at https://spotto-iota.vercel.app/

## 🚨 CRITICAL: Current Issue Fix

The localhost redirect issue you're experiencing is caused by incorrect OAuth configuration. Follow these steps exactly:

## 1. Google Cloud Console Configuration

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one

### Step 2: Enable Google+ API
1. Navigate to **APIs & Services** > **Library**
2. Search for "Google+ API" 
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - **App name**: Spotto
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App domain**: `https://spotto-iota.vercel.app`
   - **Authorized domains**: Add `spotto-iota.vercel.app` (NO https://)
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Save and continue

### Step 4: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure the following **EXACTLY**:
   - **Name**: Spotto Production
   - **Authorized JavaScript origins**:
     - `https://spotto-iota.vercel.app`
     - `http://localhost:5173` (for development)
   - **Authorized redirect URIs**:
     - `https://jjkdamyrulnpcwcfvegn.supabase.co/auth/v1/callback`
     - `https://spotto-iota.vercel.app/auth/callback`
     - `http://localhost:5173/auth/callback` (for development)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## 2. Supabase Configuration

### Step 1: Configure Google OAuth in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `jjkdamyrulnpcwcfvegn`
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click **Configure**
5. Enable Google authentication
6. Enter your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
7. Set the **Redirect URL** to: `https://jjkdamyrulnpcwcfvegn.supabase.co/auth/v1/callback`

### Step 2: Configure Site URL (CRITICAL)
1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set **Site URL** to: `https://spotto-iota.vercel.app`
3. Add **Redirect URLs** (one per line):
   ```
   https://spotto-iota.vercel.app/auth/callback
   https://spotto-iota.vercel.app/app
   https://spotto-iota.vercel.app/
   http://localhost:5173/auth/callback
   http://localhost:5173/app
   http://localhost:5173/
   ```

## 3. Environment Variables

### For Vercel Deployment
Add these environment variables in your Vercel project settings:

```env
VITE_SUPABASE_URL=https://jjkdamyrulnpcwcfvegn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa2RhbXlydWxucGN3Y2Z2ZWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODQ5ODcsImV4cCI6MjA2MTc2MDk4N30.kZiXjkZ9GNqiUjbVNZImO2mR5aq-VIER0hJ31amVmdA
```

### For Local Development (.env.local)
```env
VITE_SUPABASE_URL=https://jjkdamyrulnpcwcfvegn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa2RhbXlydWxucGN3Y2Z2ZWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxODQ5ODcsImV4cCI6MjA2MTc2MDk4N30.kZiXjkZ9GNqiUjbVNZImO2mR5aq-VIER0hJ31amVmdA
```

## 4. Testing the Setup

### Test Flow
1. Go to https://spotto-iota.vercel.app/app/login
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Should redirect back to https://spotto-iota.vercel.app/auth/callback
5. Should then redirect to the main app at https://spotto-iota.vercel.app/app

### Debug Information
The auth callback page now shows debug information including:
- Current URL
- Hostname
- Status messages
- Error details

## 5. Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Check that your redirect URIs in Google Cloud Console match exactly
   - Ensure you've added both Supabase and your app's callback URLs
   - Make sure there are no trailing slashes or typos

2. **"unauthorized_client" error**
   - Verify your Google Client ID is correct
   - Check that the OAuth consent screen is properly configured

3. **Localhost redirect on production**
   - This is the issue you're experiencing
   - Ensure Site URL in Supabase is set to production URL
   - Check that authorized JavaScript origins include production URL
   - Verify environment variables are set in Vercel

4. **CORS errors**
   - Ensure your domain is added to authorized JavaScript origins in Google Cloud Console

### Debug Steps:
1. Check browser console for errors and debug logs
2. Verify environment variables are set correctly in Vercel
3. Test the auth flow in an incognito window
4. Check Supabase auth logs in the dashboard
5. Use the debug information shown on the auth callback page

## 6. Immediate Action Required

To fix the localhost redirect issue:

1. **Update Google Cloud Console**:
   - Add `https://spotto-iota.vercel.app` to Authorized JavaScript origins
   - Add `https://jjkdamyrulnpcwcfvegn.supabase.co/auth/v1/callback` to Authorized redirect URIs

2. **Update Supabase**:
   - Set Site URL to `https://spotto-iota.vercel.app`
   - Add all redirect URLs listed above

3. **Deploy the updated code**:
   - The code changes include better hostname detection and debugging

4. **Test again**:
   - Try Google OAuth on https://spotto-iota.vercel.app/app/login
   - Check browser console for debug logs

## 7. Production Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured with correct domain
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created with production URLs
- [ ] Supabase Google provider configured
- [ ] Supabase Site URL set to production URL
- [ ] All redirect URLs added to Supabase
- [ ] Environment variables added to Vercel
- [ ] Auth callback route implemented with debugging
- [ ] Google OAuth flow tested end-to-end on production

## Support

If you still encounter issues:
1. Check the browser console for the new debug logs
2. Verify all URLs match exactly (including https/http)
3. Test in an incognito window to avoid cached auth states
4. Check both Google Cloud Console and Supabase logs for errors
5. Use the debug information on the auth callback page to identify the issue 