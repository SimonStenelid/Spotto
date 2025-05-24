#!/bin/bash

# Deploy to Vercel with environment variable check
echo "🚀 Deploying Spotto to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Build the project first to catch any build errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check your Vercel dashboard for the deployment URL"
echo "2. Verify environment variables are set in Vercel project settings"
echo "3. Test the payment flow on the deployed site"
echo "4. Check browser console for any environment variable issues"
echo ""
echo "🔧 If you see payment errors:"
echo "1. Go to Vercel project settings → Environment Variables"
echo "2. Add VITE_STRIPE_PUBLISHABLE_KEY with your Stripe key"
echo "3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
echo "4. Redeploy with: vercel --prod" 