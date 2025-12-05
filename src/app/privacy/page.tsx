import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>
            ESGTracker (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our Service.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li>Account information (name, email address)</li>
            <li>Company information for report generation</li>
            <li>Payment information (processed securely by Stripe)</li>
            <li>Communications you send to us</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Usage data and analytics</li>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the Service</li>
            <li>Generate ESG reports based on your input</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send you updates and marketing communications (with consent)</li>
            <li>Improve our Service and develop new features</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third parties that help us
              operate our Service (e.g., Stripe for payments, Supabase for
              database hosting)
            </li>
            <li>
              <strong>AI Providers:</strong> We use AI services to generate
              reports. Your company data is processed to generate reports but is
              not used to train AI models.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures including:
          </p>
          <ul>
            <li>Encryption in transit (TLS/SSL)</li>
            <li>Encryption at rest</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
          </ul>

          <h2>6. Your Rights (GDPR)</h2>
          <p>If you are in the European Union, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p>
            To exercise these rights, contact us at privacy@esgtracker.io.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as
            needed to provide services. You can request deletion of your account
            and associated data at any time.
          </p>

          <h2>8. International Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries outside
            your residence. We ensure appropriate safeguards are in place for
            such transfers in compliance with applicable data protection laws.
          </p>

          <h2>9. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management.
            We also use analytics cookies to improve our Service. You can manage
            cookie preferences in your browser settings.
          </p>

          <h2>10. Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for users under 16 years of age. We do
            not knowingly collect information from children.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes via email or through the Service.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            For privacy-related inquiries:
            <br />
            Email: privacy@esgtracker.io
            <br />
            Data Protection Officer: dpo@esgtracker.io
          </p>
        </div>
      </div>
    </div>
  );
}
