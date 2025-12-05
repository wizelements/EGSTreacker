import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  if (!supabase) {
    return NextResponse.json({ message: "Service temporarily unavailable" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: report, error } = await supabase
    .from("esg_reports")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !report) {
    return NextResponse.json({ message: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({
    report: {
      summary: report.summary,
      environmentalScore: report.environmental_score,
      socialScore: report.social_score,
      governanceScore: report.governance_score,
      overallScore: report.overall_score,
      recommendations: report.recommendations,
      environmentalDetails: report.environmental_details,
      socialDetails: report.social_details,
      governanceDetails: report.governance_details,
      complianceStatus: report.compliance_status,
      generatedAt: report.created_at,
    },
    company_name: report.company_name,
    industry: report.industry,
  });
}
