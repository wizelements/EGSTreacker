#!/bin/bash

set -e

echo "🚀 ESGTracker Deployment Script"
echo "================================"

# Check for required environment variables
required_vars=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "STRIPE_SECRET_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
  echo "❌ Missing required environment variables:"
  for var in "${missing_vars[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "Please copy .env.example to .env and fill in the values."
  exit 1
fi

echo "✅ Environment variables verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Type checking..."
npm run build

echo ""
echo "✅ Build successful!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Set up Supabase:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the schema.sql in SQL Editor"
echo "   - Enable Email auth in Authentication settings"
echo "   - (Optional) Enable Google OAuth"
echo ""
echo "2. Set up Stripe:"
echo "   - Create products and prices using the commands below"
echo "   - Set up webhook endpoint: /api/webhooks/stripe"
echo ""
echo "3. Deploy to Vercel:"
echo "   npx vercel --prod"
echo ""
echo "🎉 Ready to launch!"
