const { z } = require("zod");

 const TriageSchema = z.object({
  category: z.enum(["Spam", "Support", "Bug", "Sales", "Feature Request"]),
  urgency: z.enum(["Low", "Medium", "High", "Critical"]),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
  summary: z.string().describe("A concise one-sentence summary of the message."),
  requiresHuman: z.boolean().describe("True if a human must intervene immediately."),
});

module.exports = {
  TriageSchema
}