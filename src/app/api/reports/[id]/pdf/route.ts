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

  // Generate PDF HTML that will be rendered by the browser
  const html = generatePDFHTML(report);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

function generatePDFHTML(report: any) {
  const recommendations = (report.recommendations as string[]) || [];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ESG Report - ${report.company_name}</title>
  <style>
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #16a34a;
    }
    .logo { 
      font-size: 24px; 
      font-weight: bold; 
      color: #16a34a;
    }
    .date { color: #666; font-size: 14px; }
    .title { font-size: 28px; margin-bottom: 8px; }
    .subtitle { color: #666; font-size: 16px; margin-bottom: 30px; }
    
    .score-section {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      text-align: center;
    }
    .overall-score { font-size: 64px; font-weight: bold; color: #16a34a; }
    .score-label { font-size: 18px; color: #666; }
    
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    .score-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .score-card h3 { font-size: 14px; color: #666; margin-bottom: 8px; }
    .score-card .value { font-size: 32px; font-weight: bold; }
    .score-card.env .value { color: #16a34a; }
    .score-card.social .value { color: #2563eb; }
    .score-card.gov .value { color: #7c3aed; }
    
    .section { margin-bottom: 30px; }
    .section h2 { 
      font-size: 18px; 
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .section p { color: #374151; white-space: pre-wrap; }
    
    .recommendations { 
      background: #fffbeb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .recommendations h2 { color: #92400e; border-bottom-color: #fcd34d; }
    .recommendations ul { margin-left: 20px; margin-top: 12px; }
    .recommendations li { margin-bottom: 8px; color: #78350f; }
    
    .disclaimer {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      font-size: 12px;
      color: #6b7280;
      margin-top: 40px;
    }
    .disclaimer h3 { color: #374151; margin-bottom: 8px; font-size: 14px; }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    
    @media print {
      .no-print { display: none; }
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background:#16a34a;color:white;padding:12px;text-align:center;margin:-40px -40px 40px -40px;">
    <button onclick="window.print()" style="background:white;color:#16a34a;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-weight:bold;">
      Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="logo">ESGTracker</div>
      <div class="date">Generated: ${new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:14px;color:#666;">Report ID</div>
      <div style="font-family:monospace;font-size:12px;">${report.id.slice(0, 8)}</div>
    </div>
  </div>

  <h1 class="title">ESG Compliance Report</h1>
  <p class="subtitle">${report.company_name} • ${report.industry}</p>

  <div class="score-section">
    <div class="overall-score">${report.overall_score}</div>
    <div class="score-label">Overall ESG Score (out of 100)</div>
  </div>

  <div class="scores-grid">
    <div class="score-card env">
      <h3>Environmental</h3>
      <div class="value">${report.environmental_score}</div>
    </div>
    <div class="score-card social">
      <h3>Social</h3>
      <div class="value">${report.social_score}</div>
    </div>
    <div class="score-card gov">
      <h3>Governance</h3>
      <div class="value">${report.governance_score}</div>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <p>${report.summary || 'No summary available.'}</p>
  </div>

  <div class="section">
    <h2>Environmental Analysis</h2>
    <p>${report.environmental_details || 'No environmental details available.'}</p>
  </div>

  <div class="section">
    <h2>Social Analysis</h2>
    <p>${report.social_details || 'No social details available.'}</p>
  </div>

  <div class="section">
    <h2>Governance Analysis</h2>
    <p>${report.governance_details || 'No governance details available.'}</p>
  </div>

  <div class="section">
    <h2>EU CSRD Compliance Status</h2>
    <p>${report.compliance_status || 'Compliance status pending assessment.'}</p>
  </div>

  <div class="recommendations">
    <h2>Recommendations</h2>
    <ul>
      ${recommendations.map((r: string) => `<li>${r}</li>`).join('')}
    </ul>
  </div>

  <div class="disclaimer">
    <h3>Important Disclaimer</h3>
    <p>
      This ESG report is generated using AI and is provided for informational purposes only. 
      It does not constitute legal, financial, or professional advice. The scores and assessments 
      are based on the data provided and industry benchmarks, and may not reflect all aspects of 
      your organization's ESG performance. Always consult with qualified professionals for 
      compliance decisions and official reporting requirements. ESGTracker and its affiliates 
      accept no liability for decisions made based on this report.
    </p>
  </div>

  <div class="footer">
    <p>Generated by ESGTracker • esgtracker.io</p>
    <p>© ${new Date().getFullYear()} ESGTracker. All rights reserved.</p>
  </div>
</body>
</html>
`;
}
