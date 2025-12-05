"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Share2,
  Leaf,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";
import type { ESGReport } from "@/lib/ai";
import { formatDate } from "@/lib/utils";

function ScoreCard({
  title,
  score,
  icon: Icon,
  color,
}: {
  title: string;
  score: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{score}</span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <Progress value={score} className="h-2 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<ESGReport | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      // Check if it's a guest report (stored in sessionStorage)
      const id = params.id as string;
      if (id.startsWith("guest_")) {
        const storedReport = sessionStorage.getItem(`report_${id}`);
        if (storedReport) {
          const parsed = JSON.parse(storedReport);
          setReport(parsed.report);
          setCompanyName(parsed.companyName);
        }
      } else {
        // Fetch from API
        const response = await fetch(`/api/reports/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReport(data.report);
          setCompanyName(data.company_name);
        }
      }
      setLoading(false);
    };

    fetchReport();
  }, [params.id]);

  const handleDownload = () => {
    setShowDisclaimerModal(true);
  };

  const confirmDownload = async () => {
    setShowDisclaimerModal(false);
    // Trigger PDF generation
    window.open(`/api/reports/${params.id}/pdf`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Report Not Found</CardTitle>
            <CardDescription>
              This report may have expired or doesn&apos;t exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/generate">
              <Button>Generate New Report</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 25) return "Needs Improvement";
    return "Critical";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ESG</span>
            </div>
            <span className="font-bold text-xl">ESGTracker</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ESG Report: {companyName}</h1>
          <p className="text-muted-foreground">
            Generated on {formatDate(report.generatedAt)}
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center">
                <div
                  className={`text-6xl font-bold ${getScoreColor(
                    report.overallScore
                  )}`}
                >
                  {report.overallScore}
                </div>
                <p className="text-lg font-medium">Overall ESG Score</p>
                <p className={`${getScoreColor(report.overallScore)}`}>
                  {getScoreLabel(report.overallScore)}
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <h3 className="font-semibold mb-2">Executive Summary</h3>
                <p className="text-muted-foreground">{report.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <ScoreCard
            title="Environmental"
            score={report.environmentalScore}
            icon={Leaf}
            color="bg-green-500"
          />
          <ScoreCard
            title="Social"
            score={report.socialScore}
            icon={Users}
            color="bg-blue-500"
          />
          <ScoreCard
            title="Governance"
            score={report.governanceScore}
            icon={Building2}
            color="bg-purple-500"
          />
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                Environmental Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{report.environmentalDetails}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Social Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{report.socialDetails}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-500" />
                Governance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{report.governanceDetails}</p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              EU CSRD Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{report.complianceStatus}</p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Actionable steps to improve your ESG performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="bg-muted/50 rounded-lg p-6 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-2">Important Disclaimer</p>
              <p>
                This ESG report is generated using AI and is provided for
                informational purposes only. It does not constitute legal,
                financial, or professional advice. The scores and assessments
                are based on the data provided and industry benchmarks, and may
                not reflect all aspects of your organization&apos;s ESG
                performance. Always consult with qualified professionals for
                compliance decisions and official reporting requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Before You Download</DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p>
                This ESG report is generated by AI and is intended for
                informational and internal planning purposes only.
              </p>
              <p>
                <strong>This document does not constitute:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Legal advice or certification</li>
                <li>Official regulatory compliance documentation</li>
                <li>Audited financial or environmental data</li>
                <li>Guaranteed accuracy of all information</li>
              </ul>
              <p>
                For official ESG reporting, CSRD compliance, or regulatory
                submissions, please consult with qualified professionals and
                certified auditors.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisclaimerModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDownload}>
              I Understand, Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
