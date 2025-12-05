import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  starter: {
    name: "Starter",
    description: "Perfect for solopreneurs just getting started with ESG",
    features: [
      "3 ESG reports per month",
      "Basic compliance templates",
      "PDF export",
      "Email support",
    ],
    monthlyPrice: 19,
    annualPrice: 190,
    monthlyPriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    annualPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID!,
  },
  pro: {
    name: "Pro",
    description: "For growing businesses with advanced ESG needs",
    features: [
      "Unlimited ESG reports",
      "CSRD/EU compliance templates",
      "Custom branding",
      "API access",
      "Priority support",
      "Audit trail",
    ],
    monthlyPrice: 49,
    annualPrice: 490,
    monthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    annualPriceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
  },
} as const;

export type PlanType = keyof typeof PLANS;
