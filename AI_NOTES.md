# AI Notes. 

I used GitHub copilot (via VS Code) throughout the project for code generation and Porject scaffolding.

** Where AI accelerated me:**
- **Architecture Brainstorming:** I used Copilot to map and  validate architecture thoughts. 
- **Architecture to Code:** I used Copilot to map my architecture thoughts to code. For example, the "LLM-as-a-judge" evaluation architecture was easily turned into an evaluation ( `eval.js` ) script. 
- **Scaffolding:** It wrote the initial boilerplate for processing files (`fs.readFile`), setting up the `zod` schema, and generating the simple HTTP server/Tailwind HTML for the dashboard. This saved me hours of typing boilerplate out.

**Where it misled me or produced code I rejected:**
- **Model Versions:** At one point, Copilot suggested using an older Anthropic model string (`claude-3-haiku-20240307`), which threw a 404 API error because it wasn't available or was deprecated. I had to manually edit the code with the currently served anthropic models.
- **Prompt Caching:** It suggested enabling Anthropic Prompt Caching on the first pass. I pushed back because our prompt was too short (under 2048 tokens), so caching wouldn't have actually triggered or saved money. I opted to keep the standard prompt approach.

**Where I made calls it wouldn't have:**
- I actively steered the conversation away from building a React app and enforced the boundary of doing a simple CLI and HTML string dashboard. AI assistants often default to over-engineering (e.g., "Let's use Next.js!"), but I enforced the constraints of the take-home prompt to keep things simple.
- It also initially startedwriting code in Python, not bad but JavaScript felt like a better fit to me. 
