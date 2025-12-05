"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { PLANS } from "@/lib/stripe";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const plan = searchParams.get("plan") as "starter" | "pro" | null;
  const billing = searchParams.get("billing") || "monthly";

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  if (!plan || !["starter", "pro"].includes(plan)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Plan</CardTitle>
            <CardDescription>Please select a valid plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/#pricing">
              <Button>View Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPlan = PLANS[plan];
  const price =
    billing === "annual" ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;
  const monthlyEquivalent =
    billing === "annual"
      ? Math.round(selectedPlan.annualPrice / 12)
      : selectedPlan.monthlyPrice;

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Sign in to continue</CardTitle>
            <CardDescription>
              Create an account to subscribe to {selectedPlan.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href={`/signup?redirect=/checkout?plan=${plan}&billing=${billing}`}
            >
              <Button className="w-full">Create Account</Button>
            </Link>
            <Link
              href={`/login?redirect=/checkout?plan=${plan}&billing=${billing}`}
            >
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ESG</span>
            </div>
            <span className="font-bold text-xl">ESGTracker</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-12">
        <Link
          href="/#pricing"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to pricing
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Subscribe to {selectedPlan.name}</CardTitle>
            <CardDescription>{selectedPlan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{selectedPlan.name} Plan</span>
                <span className="text-lg font-bold">
                  ${monthlyEquivalent}/mo
                </span>
              </div>
              {billing === "annual" && (
                <p className="text-sm text-muted-foreground">
                  Billed annually (${price}/year) — Save 17%
                </p>
              )}
            </div>

            <ul className="space-y-2">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Subscribe — $${billing === "annual" ? price : monthlyEquivalent}${
                  billing === "annual" ? "/year" : "/month"
                }`
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Stripe. Cancel anytime.
              <br />
              14-day money-back guarantee.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
