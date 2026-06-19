const fs = require("fs/promises");
const { generateObject } = require("ai");
const { anthropic } = require("@ai-sdk/anthropic");
const { z } = require("zod");
require("dotenv").config();

const EvalSchema = z.object({
  pass: z
    .boolean()
    .describe(
      "True if the triage categorization, urgency, sentiment, and summary are accurate and sensible.",
    ),
  reasoning: z
    .string()
    .describe(
      "Brief explanation of why it passed or failed, noting any specific mistakes.",
    ),
});

// Helper to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function runEval() {
  try {
    const data = await fs.readFile("triaged_results.json", "utf-8");
    const allResults = JSON.parse(data);

    // Get 15 random messages
    const sampleSize = Math.min(15, allResults.length);
    const sampledResults = shuffleArray([...allResults]).slice(0, sampleSize);

    console.log(`Starting evaluation on ${sampleSize} random samples...\n`);

    let passedCount = 0;
    const evalReports = [];

    for (const item of sampledResults) {
      const prompt = `
You are an expert QA evaluator for a customer support triage system.
Review the following original user message and the system's generated triage data.
Determine if the system made sound, logical decisions based on typical business rules.

Original Message: "${item.original}"

System Triage Output:
${JSON.stringify(item.triageInfo, null, 2)}
`;

      try {
        const { object } = await generateObject({
          model: anthropic("claude-sonnet-4-6"),
          schema: EvalSchema,
          prompt,
        });

        if (object.pass) passedCount++;

        const report = {
          id: item.id,
          pass: object.pass,
          reasoning: object.reasoning,
        };

        evalReports.push(report);
        console.log(
          `[${item.id}] Pass: ${object.pass} | Reason: ${object.reasoning}`,
        );
      } catch (err) {
        console.error(`Eval failed for ${item.id}:`, err.message);
      }
    }

    const accuracy = ((passedCount / sampleSize) * 100).toFixed(1);
    console.log(`\n--- Evaluation Complete ---`);
    console.log(
      `Score: ${passedCount} / ${sampleSize} (${accuracy}% Accuracy)`,
    );

    await fs.writeFile(
      "eval_report.json",
      JSON.stringify({ accuracy, results: evalReports }, null, 2),
    );
    console.log("Detailed report saved to eval_report.json");
  } catch (error) {
    console.error("Evaluation error:", error.message);
  }
}

runEval();
