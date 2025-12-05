import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase credentials");
  }
  return createClient(url, key);
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { user_id, plan, billing } = session.metadata || {};

        if (user_id && plan) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: plan as "starter" | "pro",
              subscription_period: billing as "monthly" | "annual",
              stripe_customer_id: session.customer as string,
            })
            .eq("id", user_id);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const isActive = ["active", "trialing"].includes(subscription.status);
          
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: isActive
                ? (subscription.metadata.plan as "starter" | "pro") || "starter"
                : "cancelled",
              subscription_end_date: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "free",
            subscription_period: null,
            subscription_end_date: null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Could send email notification here
        console.log(`Payment failed for customer: ${customerId}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
