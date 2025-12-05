"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ESGData } from "@/lib/ai";

const industries = [
  "Technology",
  "E-commerce",
  "Professional Services",
  "Manufacturing",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Education",
  "Retail",
  "Food & Beverage",
  "Transportation",
  "Energy",
  "Other",
];

const steps = [
  { id: 1, title: "Company Info" },
  { id: 2, title: "Environmental" },
  { id: 3, title: "Social & Governance" },
];

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ESGData>>({});
  const router = useRouter();

  const updateFormData = (field: keyof ESGData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.industry) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate report");
      }

      const { reportId } = await response.json();
      router.push(`/report/${reportId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const progress = (step / steps.length) * 100;

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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Generate Your ESG Report</h1>
          <p className="text-muted-foreground">
            Answer a few questions and get your audit-ready report in under 3 minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s) => (
              <span
                key={s.id}
                className={`text-sm ${
                  s.id <= step ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {s.title}
              </span>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Tell us about your company"}
              {step === 2 && "Environmental data"}
              {step === 3 && "Social & Governance"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic information to personalize your report"}
              {step === 2 && "Optional - helps improve accuracy"}
              {step === 3 && "Optional - for a more comprehensive analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    value={formData.companyName || ""}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(v) => updateFormData("industry", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Input
                      id="employees"
                      type="number"
                      placeholder="10"
                      value={formData.employeeCount || ""}
                      onChange={(e) =>
                        updateFormData("employeeCount", parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue (USD)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="100000"
                      value={formData.annualRevenue || ""}
                      onChange={(e) =>
                        updateFormData("annualRevenue", parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Leave blank if you don&apos;t have exact figures - we&apos;ll estimate based on
                  industry benchmarks.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="energy">Annual Energy Usage (kWh)</Label>
                  <Input
                    id="energy"
                    type="number"
                    placeholder="50000"
                    value={formData.energyUsage || ""}
                    onChange={(e) =>
                      updateFormData("energyUsage", parseInt(e.target.value) || undefined)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water">Annual Water Usage (gallons)</Label>
                  <Input
                    id="water"
                    type="number"
                    placeholder="10000"
                    value={formData.waterUsage || ""}
                    onChange={(e) =>
                      updateFormData("waterUsage", parseInt(e.target.value) || undefined)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waste">Annual Waste Generated (kg)</Label>
                  <Input
                    id="waste"
                    type="number"
                    placeholder="1000"
                    value={formData.wasteGenerated || ""}
                    onChange={(e) =>
                      updateFormData("wasteGenerated", parseInt(e.target.value) || undefined)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbon">Carbon Emissions (tonnes CO2e)</Label>
                  <Input
                    id="carbon"
                    type="number"
                    placeholder="50"
                    value={formData.carbonEmissions || ""}
                    onChange={(e) =>
                      updateFormData("carbonEmissions", parseInt(e.target.value) || undefined)
                    }
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Help us understand your company&apos;s social and governance practices.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="genderRatio">Gender Ratio (e.g., &ldquo;50% F / 50% M&rdquo;)</Label>
                  <Input
                    id="genderRatio"
                    placeholder="50% F / 50% M"
                    value={formData.diversityMetrics?.genderRatio || ""}
                    onChange={(e) =>
                      updateFormData("diversityMetrics", {
                        ...formData.diversityMetrics,
                        genderRatio: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boardSize">Board/Leadership Size</Label>
                  <Input
                    id="boardSize"
                    type="number"
                    placeholder="5"
                    value={formData.governance?.boardSize || ""}
                    onChange={(e) =>
                      updateFormData("governance", {
                        ...formData.governance,
                        boardSize: parseInt(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < steps.length ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your data is encrypted and never shared with third parties.
        </p>
      </div>
    </div>
  );
}
