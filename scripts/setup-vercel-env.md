# Setting up Environment Variables in Vercel

## The Issue
The payment error `Cannot read properties of undefined (reading 'match')` is caused by missing or incorrectly configured environment variables in your Vercel deployment.

## Required Environment Variables

You need to set these environment variables in your Vercel project:

### 1. Stripe Configuration
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RRh8gCM7Q3fmVNpOYQJKLMNOPQRSTUVWXYZ...
VITE_STRIPE_PRICE_ID=price_1RRidMCM7Q3fmVNpIYWtVOwT
```

### 2. Supabase Configuration
```
VITE_SUPABASE_URL=https://jjkdamyrulnpcwcfvegn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## How to Set Environment Variables in Vercel

### Option 1: Via Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable:
   - Name: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: Your Stripe publishable key (starts with `pk_`)
   - Environment: Production, Preview, Development (select all)
4. Repeat for all required variables

### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Set environment variables
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add VITE_STRIPE_PRICE_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Option 3: Via .env File Upload
1. Create a `.env.production` file with your variables
2. In Vercel dashboard, go to Settings → Environment Variables
3. Click "Import .env File" and upload your file

## Important Notes

1. **Variable Names**: Make sure to use the exact names with `VITE_` prefix
2. **Stripe Key Format**: Must start with `pk_test_` or `pk_live_`
3. **Price ID**: Use the correct price ID `price_1RRidMCM7Q3fmVNpIYWtVOwT`
4. **Redeploy**: After adding environment variables, trigger a new deployment
5. **Security**: Never commit real API keys to your repository

## Testing the Fix

After setting the environment variables:

1. Trigger a new deployment in Vercel
2. Visit your deployed site
3. Check the browser console for the debug information
4. Try the payment flow again

## Debugging

If you still see issues:

1. Check the browser console for environment variable values
2. Verify the variables are set correctly in Vercel dashboard
3. Ensure you've redeployed after setting the variables
4. Check that the variable names match exactly (case-sensitive)

## Quick Fix Command

Run this in your terminal to redeploy with environment variables:

```bash
vercel --prod
```

This will trigger a new production deployment that should pick up your environment variables. 