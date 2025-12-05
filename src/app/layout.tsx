import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ESGTracker - AI-Powered ESG Compliance Reports in Minutes",
  description:
    "Generate audit-ready ESG and CSRD compliance reports for your business in under 3 minutes. Trusted by 500+ solopreneurs.",
  keywords: ["ESG", "CSRD", "compliance", "sustainability", "audit", "report"],
  openGraph: {
    title: "ESGTracker - AI-Powered ESG Compliance Reports",
    description: "Generate audit-ready ESG reports in under 3 minutes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
