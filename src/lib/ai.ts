export interface ESGData {
  companyName: string;
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  energyUsage?: number;
  wasteGenerated?: number;
  waterUsage?: number;
  carbonEmissions?: number;
  diversityMetrics?: {
    genderRatio?: string;
    minorityRepresentation?: string;
  };
  governance?: {
    boardSize?: number;
    independentDirectors?: number;
    hasEthicsPolicy?: boolean;
  };
}

export interface ESGReport {
  summary: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  overallScore: number;
  recommendations: string[];
  environmentalDetails: string;
  socialDetails: string;
  governanceDetails: string;
  complianceStatus: string;
  generatedAt: string;
}

const ESG_PROMPT = `You are an ESG (Environmental, Social, Governance) compliance expert. Analyze the provided company data and generate a comprehensive ESG report.

IMPORTANT: Your response must be valid JSON matching this exact structure:
{
  "summary": "Brief executive summary of ESG performance",
  "environmentalScore": 0-100,
  "socialScore": 0-100,
  "governanceScore": 0-100,
  "overallScore": 0-100,
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "environmentalDetails": "Detailed environmental analysis",
  "socialDetails": "Detailed social analysis",
  "governanceDetails": "Detailed governance analysis",
  "complianceStatus": "EU CSRD compliance status assessment"
}

Base your analysis on industry standards, available data, and ESG best practices. Be specific and actionable.`;

export async function generateESGReport(data: ESGData): Promise<ESGReport> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GROK_API_KEY;
  
  if (!apiKey) {
    throw new Error("No AI API key configured");
  }

  const isOpenRouter = !!process.env.OPENROUTER_API_KEY;
  const endpoint = isOpenRouter
    ? "https://openrouter.ai/api/v1/chat/completions"
    : "https://api.x.ai/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(isOpenRouter && { "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL }),
    },
    body: JSON.stringify({
      model: isOpenRouter ? "x-ai/grok-2-1212" : "grok-2-latest",
      messages: [
        { role: "system", content: ESG_PROMPT },
        {
          role: "user",
          content: `Generate an ESG report for this company:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${error}`);
  }

  const result = await response.json();
  const content = result.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response from AI");
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid AI response format");
  }

  const report = JSON.parse(jsonMatch[0]) as ESGReport;
  report.generatedAt = new Date().toISOString();

  return report;
}
