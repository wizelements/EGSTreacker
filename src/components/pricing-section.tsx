"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, Sparkles } from "lucide-react";

const plans = {
  starter: {
    name: "Starter",
    description: "Perfect for solopreneurs just getting started",
    monthlyPrice: 19,
    annualPrice: 190,
    features: [
      "3 ESG reports per month",
      "Basic compliance templates",
      "PDF export with branding",
      "Email support",
      "30-day report history",
    ],
    popular: false,
  },
  pro: {
    name: "Pro",
    description: "For growing businesses with advanced needs",
    monthlyPrice: 49,
    annualPrice: 490,
    features: [
      "Unlimited ESG reports",
      "CSRD/EU compliance templates",
      "Custom company branding",
      "API access",
      "Priority support",
      "Full audit trail",
      "Team collaboration (coming soon)",
      "Historical analytics",
    ],
    popular: true,
  },
};

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mb-8">
            Start free. Upgrade when you need more.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Label
              htmlFor="billing-toggle"
              className={!isAnnual ? "font-semibold" : "text-muted-foreground"}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label
              htmlFor="billing-toggle"
              className={isAnnual ? "font-semibold" : "text-muted-foreground"}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              className={`relative ${
                plan.popular
                  ? "border-primary border-2 shadow-lg"
                  : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-5xl font-bold">
                    ${isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {isAnnual && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed ${plan.annualPrice}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={`/checkout?plan=${key}&billing=${isAnnual ? 'annual' : 'monthly'}`} className="w-full">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
