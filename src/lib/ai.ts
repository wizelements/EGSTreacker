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

type AIProvider = "openai" | "openrouter" | "anthropic";

function getProviderConfig(): { provider: AIProvider; apiKey: string; model: string } {
  // Check for OpenAI key first
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o",
    };
  }

  // Check for OpenRouter key
  if (process.env.OPENROUTER_API_KEY) {
    return {
      provider: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY,
      model: "openai/gpt-4o",
    };
  }

  // Check for Anthropic key
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-5-sonnet-20241022",
    };
  }

  throw new Error(
    "No AI API key configured. Please set OPENAI_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY in your environment variables."
  );
}

async function callOpenAI(apiKey: string, model: string, data: ESGData): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
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
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || "";
}

async function callOpenRouter(apiKey: string, model: string, data: ESGData): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
    body: JSON.stringify({
      model,
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
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content || "";
}

async function callAnthropic(apiKey: string, model: string, data: ESGData): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: ESG_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate an ESG report for this company:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const result = await response.json();
  return result.content[0]?.text || "";
}

export async function generateESGReport(data: ESGData): Promise<ESGReport> {
  try {
    const config = getProviderConfig();
    let content: string;

    switch (config.provider) {
      case "openai":
        content = await callOpenAI(config.apiKey, config.model, data);
        break;
      case "openrouter":
        content = await callOpenRouter(config.apiKey, config.model, data);
        break;
      case "anthropic":
        content = await callAnthropic(config.apiKey, config.model, data);
        break;
      default:
        throw new Error("Unknown AI provider");
    }

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format - no JSON found");
    }

    const report = JSON.parse(jsonMatch[0]) as ESGReport;
    report.generatedAt = new Date().toISOString();

    return report;
  } catch (error) {
    console.error("ESG Report generation error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to generate ESG report. Please try again.");
  }
}
