import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateESGReport, type ESGData } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const data: ESGData = await request.json();

    if (!data.companyName || !data.industry) {
      return NextResponse.json(
        { message: "Company name and industry are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user has report quota (if logged in)
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status, reports_used_this_month")
        .eq("id", user.id)
        .single();

      if (profile) {
        const limit =
          profile.subscription_status === "pro"
            ? Infinity
            : profile.subscription_status === "starter"
            ? 3
            : 1; // Free tier gets 1 report

        if (profile.reports_used_this_month >= limit) {
          return NextResponse.json(
            { message: "You've reached your monthly report limit. Please upgrade." },
            { status: 403 }
          );
        }
      }
    }

    // Generate the ESG report using AI
    const report = await generateESGReport(data);

    // Store the report if user is logged in
    let reportId: string | null = null;
    if (user) {
      const { data: savedReport, error } = await supabase
        .from("esg_reports")
        .insert({
          user_id: user.id,
          company_name: data.companyName,
          industry: data.industry,
          employee_count: data.employeeCount,
          annual_revenue: data.annualRevenue,
          environmental_score: report.environmentalScore,
          social_score: report.socialScore,
          governance_score: report.governanceScore,
          overall_score: report.overallScore,
          summary: report.summary,
          environmental_details: report.environmentalDetails,
          social_details: report.socialDetails,
          governance_details: report.governanceDetails,
          compliance_status: report.complianceStatus,
          recommendations: report.recommendations,
          input_data: data,
          is_guest_report: false,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Failed to save report:", error);
      } else {
        reportId = savedReport.id;
      }

      // Increment reports used
      await supabase.rpc("increment_reports_used", { user_id: user.id });
    } else {
      // For guest users, store temporarily in a different way or skip
      // For now, we'll create a temporary ID
      reportId = `guest_${Date.now()}`;
      // Store in cookies/session for guest access
    }

    return NextResponse.json({
      reportId,
      report,
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to generate report" },
      { status: 500 }
    );
  }
}
