// This is the entry point of our CLI based processing pipeline.

// Import file system.
const fs = require("fs/promises");
// Import pre-processing pipeline.
const { preprocessMessage } = require("./preprocessing");

// Import AI SDK and Validation Libraries.
const { generateObject } = require("ai");
const { anthropic } = require("@ai-sdk/anthropic");
const { z } = require("zod");

// Import the triage scheam.
const { TriageSchema } = require("./triageSchema");

// LOAD env variables.
require("dotenv").config();

async function main() {
  // Grab the file path from the command line arguments
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Error: Please provide a path to the messages file.");
    console.error("Usage: node index.js <path-to-messages.json>");
    process.exit(1);
  }

  try {
    // Read the file and parse the JSON contents
    const fileData = await fs.readFile(filePath, "utf-8");
    const messages = JSON.parse(fileData);

    console.log(
      `Successfully loaded ${messages.length} messages from ${filePath}.`,
    );

    const validMessages = [];
    const invalidMessages = [];

    // Pre-process and validate messages
    for (const msg of messages) {
      const result = preprocessMessage(msg);
      if (result.valid) {
        // Store both the ID and the validated text
        validMessages.push({ id: msg.id, text: result.content });
      } else {
        invalidMessages.push({ original: msg, reason: result.reason });
      }
    }

    console.log(
      `Pre-processing complete: ${validMessages.length} valid, ${invalidMessages.length} invalid or skipped.`,
    );

    console.log(invalidMessages);

    console.log("Starting AI Triage on valid messages...");
    const triagedResults = [];

    // Process valid messages sequentially
    for (const msgObj of validMessages) {
      try {
        const { object } = await generateObject({
          model: anthropic("claude-haiku-4-5-20251001"),
          schema: TriageSchema,
          prompt: `Analyze the following inbound user message and perform triage.\n\nMessage:\n"${msgObj.text}"`,
        });

        triagedResults.push({
          id: msgObj.id,
          original: msgObj.text,
          triageInfo: object,
        });

        console.log(
          `Processed [${msgObj.id}]: [${object.category}] ${object.summary}`,
        );
      } catch (aiError) {
        console.error("AI Triage failed for a message:", aiError);
      }
    }

    console.log("\n--- Final Triage Results ---");
    console.log(JSON.stringify(triagedResults, null, 2));

    // Optional: Save results to a file
    await fs.writeFile(
      "triaged_results.json",
      JSON.stringify(triagedResults, null, 2),
    );
    console.log("Saved results to triaged_results.json");
  } catch (error) {
    console.error("Error reading or parsing the file:", error.message);
    process.exit(1);
  }
}

main();
