import OpenAI from "openai";

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

// Initialize OpenAI client with Emergent Universal Key
const getOpenAIClient = () => {
  const apiKey = process.env.EMERGENT_LLM_KEY;
  
  if (!apiKey) {
    throw new Error("EMERGENT_LLM_KEY is not configured");
  }

  return new OpenAI({
    apiKey,
  });
};

export async function generateESGReport(data: ESGData): Promise<ESGReport> {
  try {
    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ESG_PROMPT },
        {
          role: "user",
          content: `Generate an ESG report for this company:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON response
    const report = JSON.parse(content) as ESGReport;
    report.generatedAt = new Date().toISOString();

    return report;
  } catch (error) {
    console.error("ESG Report generation error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate ESG report"
    );
  }
}
