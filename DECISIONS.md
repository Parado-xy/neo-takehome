# Architecture & Design Decisions

## 1. Ambiguities Resolved

The brief asked to "triage" and "handle" messages without defining either.

- **What is "Triage"?** I defined triage as extracting a strict structure from unstructured data: `Category`, `Urgency`, `Sentiment`, `Summary`, and a `requiresHuman` boolean.
- **What is "Handle"?** I explicitly decided _not_ to build the downstream execution (e.g., auto-replying or creating Zendesk tickets). In a real startup, the best first step for AI is a "Copilot" routing state, not full autonomic execution. "Handling" here means perfectly structuring the data so a traditional deterministic router can act on it reliably.
- **Language Assumptions:** I assumed the primary support team speaks English. I built a heuristic pre-processor to catch gibberish and largely non-English text to prevent wasting tokens.

## 2. Key Design Choices & Tradeoffs

- **CLI Batch Pipeline over Web API:**
  - _Tradeoff:_ I chose a local Node.js CLI script rather than a Fastify/Express API or a React app.
  - _Reasoning:_ The brief explicitly prioritizes core engineering and evaluation over UIs and infra. A CLI script reads the batch data, processes it, and outputs JSON. It is trivially easy to run, test, and adapt into a serverless cron job or queue worker later.

- **Dual-LLM Architecture:**
  - _Tradeoff:_ I used Claude 4.5 Haiku for the main triage loop and Claude 4.5 Sonnet for the evaluation script.
  - _Reasoning:_ Haiku is exceptionally fast and cheap, making it perfect for high-volume ingestion triage. Sonnet is slower and more expensive but possesses superior reasoning, making it ideal for the "LLM-as-a-judge" evaluation step.

- **Zod + Structured Outputs over Raw Prompts:**
  - _Reasoning:_ Enforcing the LLM's output against a strict `zod` schema guarantees that the downstream application will not crash due to malformed JSON or unexpected category types.

## 3. What I Deliberately Did NOT Build

- **A Database:** Writing to Postgres or SQLite would have eaten up time for no distinct architectural advantage at this stage. I used the file system (`.json` files) as a mock database.
- **A Frontend Framework:** Instead of a complex React/Next.js setup, I built a zero-dependency local Node.js HTTP server returning a plain HTML template layered with Tailwind via CDN. It demonstrates the product visually without the overhead.
- **Third-Party Routing:** I skipped integrating with Slack, Jira, or Zendesk APIs to keep the codebase runnable on any machine without relying on external system authentications.

## 4. Where This Breaks (Failure Modes)

- **Rate Limiting:** The `index.js` file currently processes messages in a tight `for...of` loop. At 10,000x volume, this needs to be decoupled into a proper queue  (like AWS SQS or BullMQ) to handle concurrency, retries, and API rate limits.
- **The English Heuristic:** The `isBasicEnglish` pre-processor uses a basic Regex ratio. It will currently drop perfectly valid Spanish or Japanese support tickets, which would embarrass me in front of an international customer.
- **Context Windows:** A user pasting a 100MB log file into a support widget would crash the LLM context window. The pre-processor needs max-token truncation.

## 5. What I'd Do With More Time (Prioritized)

1. **Implement real language detection** (`franc` or `cld`) instead of regex heuristics, and add an auto-translation step before triage.
2. **Add Concurrency + Backoff:** Use `p-limit` to process 5-10 messages concurrently to speed up the batch processor while respecting Anthropic's rate limits.
3. **Few-Shot Prompting Validation:** Introduce 20 manually labeled, verified edge-case messages (e.g., prompt injections, sarcastic bugs) into the system prompt to guide the Haiku model on exactly how to parse tricky intents.

## 6. Evaluation  Strategy and Limitations.
**What the Evaluation Tells Us**
- Plausibility & Logic: It strongly indicates whether the fast triage model (Haiku) generated a logical response based on typical business rules. The judge model (Sonnet) confirms if the combination of categories, urgency, and sentiment matches the content of the text.
- Failure Modes: It gives us explainable reasons for failures. For example, your eval_report.json caught that msg-026 (a simple "how do I invite a teammate" question) was incorrectly flagged as requiresHuman: true when a bot could easily handle it with a docs link.
- A Baseline Metric: It provides a rough, quantifiable baseline (93.3% accuracy) so that if you change the prompt, adjust the schema, or switch to a cheaper model, you can instantly see if you degraded the system's performance.

**What the Evaluation Does NOT Tell Us**
- Absolute "Ground Truth" Accuracy: You are using an LLM to grade an LLM. Sonnet might have its own biases or hallucinate criteria. Without a human-labeled "golden dataset" to compare against, a 93% score is just agreement between models, not an objective truth.
- Edge Case Coverage: Because eval.js samples 15 random messages, a single run might miss how the system handles critical edge cases like prompt injections (e.g., msg-009), extreme lengths, or non-English languages if they don't get randomly selected.
- Category Imbalance (Precision vs Recall): A binary pass/fail doesn't tell you if the model is systemically over-categorizing things. For example, it might label 100% of "Sales" accurately, but routinely misclassify "Feature Requests" as "Bugs". The overall score hides these specific biases.
- Latency and Cost: The eval grades the quality of the inference but doesn't tell you the pipeline's throughput, how many tokens were wasted, or if the pipeline will survive 100x volume.