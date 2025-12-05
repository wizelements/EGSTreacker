/**
 * Test script for Emergent LLM integration
 * Run with: node test-ai.js
 */

// Load environment variables
require('dotenv').config();
const OpenAI = require('openai');

async function testESGGeneration() {
  console.log('🧪 Testing Emergent LLM Integration with GPT-4o...\n');

  try {
    // Initialize OpenAI client with Emergent Universal Key
    const apiKey = process.env.EMERGENT_LLM_KEY;
    
    if (!apiKey) {
      throw new Error('❌ EMERGENT_LLM_KEY not found in environment variables');
    }

    console.log('✅ Emergent LLM Key found');
    console.log(`   Key: ${apiKey.substring(0, 20)}...`);

    // Use the Emergent Integration Proxy URL
    const baseURL = "https://integrations.emergentagent.com/v1";
    console.log(`   Proxy: ${baseURL}`);

    const openai = new OpenAI({ 
      apiKey,
      baseURL
    });

    // Test data for ESG report generation
    const testData = {
      companyName: "GreenTech Solutions",
      industry: "Technology",
      employeeCount: 50,
      annualRevenue: 5000000,
      energyUsage: 100000,
      wasteGenerated: 5000,
      carbonEmissions: 200
    };

    console.log('\n📊 Generating ESG Report for:');
    console.log(`   Company: ${testData.companyName}`);
    console.log(`   Industry: ${testData.industry}`);
    console.log(`   Employees: ${testData.employeeCount}`);

    const prompt = `You are an ESG (Environmental, Social, Governance) compliance expert. Generate a comprehensive ESG report based on the following company data:

${JSON.stringify(testData, null, 2)}

Return ONLY valid JSON with this structure:
{
  "summary": "Brief executive summary",
  "environmentalScore": 75,
  "socialScore": 80,
  "governanceScore": 85,
  "overallScore": 80,
  "recommendations": ["rec1", "rec2"],
  "environmentalDetails": "Environmental analysis",
  "socialDetails": "Social analysis",
  "governanceDetails": "Governance analysis",
  "complianceStatus": "CSRD compliance status"
}`;

    console.log('\n🤖 Calling GPT-4o via Emergent Universal Key...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an ESG compliance expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('❌ No response from AI');
    }

    console.log('✅ Response received from GPT-4o!\n');

    const report = JSON.parse(response);

    console.log('📄 Generated ESG Report:');
    console.log('─'.repeat(60));
    console.log(`Summary: ${report.summary?.substring(0, 100)}...`);
    console.log(`\nScores:`);
    console.log(`  • Environmental: ${report.environmentalScore}/100`);
    console.log(`  • Social: ${report.socialScore}/100`);
    console.log(`  • Governance: ${report.governanceScore}/100`);
    console.log(`  • Overall: ${report.overallScore}/100`);
    console.log(`\nRecommendations (${report.recommendations?.length || 0}):`);
    report.recommendations?.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec.substring(0, 80)}...`);
    });
    console.log('─'.repeat(60));

    console.log('\n✅ TEST PASSED! Emergent LLM integration with GPT-4o is working correctly!');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testESGGeneration();
