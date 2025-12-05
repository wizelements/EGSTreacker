# Stripe Setup Guide

## Create Products and Prices

Run these commands with the Stripe CLI:

```bash
# Install Stripe CLI (if not already installed)
# macOS: brew install stripe/stripe-cli/stripe
# Linux: See https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Create Starter Product
stripe products create \
  --name="ESGTracker Starter" \
  --description="3 ESG reports per month, Basic templates, PDF export"

# Create Starter Monthly Price ($19/mo)
stripe prices create \
  --product="prod_STARTER_ID" \
  --unit-amount=1900 \
  --currency=usd \
  --recurring[interval]=month

# Create Starter Annual Price ($190/yr - 2 months free)
stripe prices create \
  --product="prod_STARTER_ID" \
  --unit-amount=19000 \
  --currency=usd \
  --recurring[interval]=year

# Create Pro Product
stripe products create \
  --name="ESGTracker Pro" \
  --description="Unlimited ESG reports, CSRD templates, Custom branding, API access"

# Create Pro Monthly Price ($49/mo)
stripe prices create \
  --product="prod_PRO_ID" \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month

# Create Pro Annual Price ($490/yr - 2 months free)
stripe prices create \
  --product="prod_PRO_ID" \
  --unit-amount=49000 \
  --currency=usd \
  --recurring[interval]=year
```

## Set Up Webhook

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Local Testing

```bash
# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Use the webhook signing secret shown in terminal
```

## Environment Variables

Add these to your `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_MONTHLY_PRICE_ID=price_...
STRIPE_STARTER_ANNUAL_PRICE_ID=price_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
```
