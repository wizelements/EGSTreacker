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
import {
  CheckCircle,
  Shield,
  Zap,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
} from "lucide-react";
import { PricingSection } from "@/components/pricing-section";

const features = [
  {
    icon: Zap,
    title: "3-Minute Reports",
    description:
      "AI generates comprehensive ESG reports faster than making coffee",
  },
  {
    icon: Shield,
    title: "EU CSRD Compliant",
    description:
      "Templates built for European regulatory requirements out of the box",
  },
  {
    icon: FileText,
    title: "Audit-Ready PDFs",
    description:
      "Professional documents ready for investors, auditors, and stakeholders",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your ESG scores over time with historical reporting",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Founder, GreenTech Solutions",
    content:
      "ESGTracker saved me 40+ hours on compliance documentation. The AI actually understands my business.",
    rating: 5,
  },
  {
    name: "Marcus J.",
    role: "Solo Consultant",
    content:
      "I was dreading CSRD compliance until I found this. Generated my first report in literally 2 minutes.",
    rating: 5,
  },
  {
    name: "Elena K.",
    role: "E-commerce Owner",
    content:
      "My investors were impressed with the professional ESG report. They had no idea I made it in minutes.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ESG</span>
              </div>
              <span className="font-bold text-xl">ESGTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/generate">
                <Button>
                  Try Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="animate-pulse">🔥</span>
            <span>2,347 reports generated this week</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Stop Stressing About{" "}
            <span className="text-primary">ESG Compliance</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            EU regulators are cracking down. Large clients demand ESG reports.
            Generate yours in under 3 minutes with AI — no consultants, no
            $10k+ fees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/generate">
              <Button size="lg" className="text-lg px-8 py-6">
                Generate Your First Report Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch 60s Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>GDPR compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-16 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            ⚠️ The Problem No One Talks About
          </h2>
          <p className="text-red-700 mb-6">
            By 2025, EU CSRD regulations require ESG reporting for 50,000+
            companies. Non-compliance means fines up to €10M or 5% of global
            turnover. Traditional consultants charge $5,000–$50,000 per report.
          </p>
          <p className="text-lg font-semibold text-green-800">
            ESGTracker: Professional ESG reports from $19/month. Generate
            unlimited reports in minutes, not months.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need for ESG Compliance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by compliance experts, powered by AI. Get investor-ready ESG
              reports without the enterprise price tag.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by 500+ Solopreneurs
            </h2>
            <p className="text-muted-foreground">
              Join founders who stopped worrying about ESG compliance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-white">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-foreground text-base">
                    &ldquo;{testimonial.content}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get ESG Compliant in 3 Minutes?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Your first report is completely free. No credit card required.
          </p>
          <Link href="/generate">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              Generate Free Report Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ESG</span>
                </div>
                <span className="font-bold">ESGTracker</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered ESG compliance for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/generate">Generate Report</Link></li>
                <li><Link href="/#pricing">Pricing</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/disclaimer">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:support@esgtracker.io">Contact</a></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ESGTracker. All rights reserved.</p>
            <p className="mt-2">
              ESGTracker provides informational reports only and does not
              constitute legal, financial, or professional advice. Always
              consult qualified professionals for compliance decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
