# AI Customer Support Triage Pipeline

This is a lightweight, local batch-processing pipeline that ingests unstructured customer messages, filters out noise, triages them using an LLM (Claude 4.5 Haiku), and evaluates the system's performance using an LLM-as-a-judge (Claude 4.5 Sonnet).

## Prerequisites

- Node.js (v18+ recommended)
- An Anthropic API Key

## Setup & Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Running the System

The system is broken down into three distinct modules to separate processing, evaluation, and visualization.

### 1. Run the Triage Pipeline

This runs the pre-processing heuristics (filtering out short, empty, or non-English messages) and passes the valid ones to Claude 3.5 Haiku to exact a structured strict schema.

```bash
node index.js messages.json
```

_Outputs: `triaged_results.json`_

### 2. Run the Evaluation

This tackles the "how do we trust it" requirement. It randomly samples 15 triaged messages and feeds them to a stronger model (Claude 4.5 Sonnet) with a strict grading rubric to calculate an accuracy score.

```bash
node eval.js
```

_Outputs: `eval_report.json`_

### 3. View the Dashboard

Spins up a local, dependency-free HTTP server showing the stats, triage results (sorted by urgency), and grading reports using Tailwind CSS.

```bash
node dashboard.js messages.json
```

_Open `http://localhost:3000` in your browser._

---

**Time Spent:** I spent roughly 4 hours on this over a period of 2 days. I recieved this on Tuesday, and worked a job from Tueday-Thursday, actual work on the project happened on Friday. 