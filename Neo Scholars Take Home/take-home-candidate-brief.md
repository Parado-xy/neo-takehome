# Neo Scholars (2026) — Take-Home Project

## Read this first

This is a **substantial project**, not a toy exercise. I am asking you to build something real because the job is building real things. We are not testing whether you can write code — we know you can. I am testing **engineering judgment**: how you scope an underspecified problem, the design choices you make and can defend, what you build versus deliberately leave out, and whether you can prove your work is actually good.

**Time: 24–72 hours of calendar time, and we expect this to take roughly a solid day of focused work.** You don't need to spend all 72 hours — that window is so you can fit it around your life. Be honest with yourself and with me about how much time you actually spent; I'll ask. Scope your ambition to the time you have. A focused, coherent project you can stand behind beats a sprawling one you can't.

**You may use AI tools (Claude, Cursor, Copilot, whatever you use day to day), and we encourage it.** This is how teams actually work. Using AI well is a real skill and I want to see it. **Keep a lightweight record of how you used it** — where it accelerated you, where it produced something you had to throw away or fix, where you overrode it and why. We'll talk about this in the live review, and "I used AI thoughtfully as an accelerant" is a much stronger story than "AI wrote it and I'm not sure why it works."

**There's a live review afterward.** Once you submit, we'll schedule a **45-minute call** to walk through your project together. We'll dig into your design choices, what you found easy and hard, what you'd do with more time, and how you used AI. Build with that conversation in mind: you should be able to defend every meaningful decision and speak to the parts you're least sure about.

---

## The scenario

You've just joined an early-stage applied-AI company as a founding engineer. A design partner (our first real customer) sends this to the team Slack:

> "We get a flood of inbound messages from our users — support questions, bug reports, feature requests, sales leads, random spam, the occasional angry rant. Right now a human reads every one and decides what to do with it. It doesn't scale and things fall through the cracks. Can you build us something that reads these and handles the triage automatically? We need to trust it. Go."

That is the entire spec. There is no PRD, no schema, no labeled dataset. The CEO is traveling and slow to respond. **This is deliberate.** Turning a vague, high-stakes ask into a working system is the job. You decide what "triage" means, what "handle" means, and where the system's responsibilities start and stop — and you defend those decisions.

You have a sample of real-ish inbound messages to work from (see "Data"). It's representative but unlabeled and messy, like real life.

---

## What to build

A **working system** that ingests these messages and does something genuinely useful with them — and the engineering around it that makes it trustworthy. You set the scope. I am far more interested in the *quality and coherence* of what you build and the *reasoning behind it* than in raw surface area.

This is open-ended on purpose, but a strong submission generally demonstrates most of these:

- **A real, runnable system** — not a notebook of one-off cells. Something with a sensible structure that someone else could run, extend, and reason about. Reasonable code organization, error handling on the paths that matter, and a clear entry point.
- **Thoughtful handling of the hard inputs.** The data has edge cases. How your system behaves on the messy, ambiguous, and adversarial inputs is more telling than how it handles the easy ones.
- **An evaluation you actually built and ran.** "We need to trust it" is the core requirement. With no labels, how do you *know* it works? Design and implement a real way to measure quality, run it, and report results — including what the eval does and doesn't tell you.
- **Decisions made explicit.** A design doc capturing the choices, tradeoffs, and the alternatives you rejected.

Don't gold-plate. I am not asking for auth, a polished UI, deployment, or production infra unless you have a specific reason and the time. Effort spent on things I didn't ask for, at the expense of the core problem or the eval, counts against you. Knowing where to stop is part of the test.

---

## Deliverables

Submit a git repo (or zip) containing:

1. **The system** — your code, organized like you'd want a teammate to find it.
2. **`README.md`** — how to run it (first-try runnable, please), what it does, and an honest note on how much time you spent and where it went.
3. **`DECISIONS.md`** — the heart of the submission:
   - **The ambiguities you found in the request and how you resolved each.** What did the design partner *not* tell you that you had to decide? State your assumptions explicitly, and which you'd verify first with the customer.
   - **The key design choices and tradeoffs**, each with the alternative you rejected and the condition under which you'd switch.
   - **What you deliberately did NOT build, and why.** This section carries real weight.
   - **Where this breaks** — failure modes, behavior at 100x volume, what would embarrass you in front of the customer.
   - **What you'd do with more time** — prioritized.
4. **Your evaluation** — the eval code plus a short results write-up.
5. **`AI_NOTES.md`** — a short, honest account of how you used AI: where it accelerated you, where it misled you or produced code you rejected, and where you made a call it wouldn't have. A few paragraphs is plenty.

---

## Data

A folder of ~40 sample inbound messages is provided (`messages/`) as JSON. They're unlabeled and intentionally messy — varying length, quality, language, and intent, with edge cases mixed in. If you want more data, you may synthesize additional examples; if you do, say why and how.

> If no data folder is attached, generate ~30–40 realistic, varied sample messages yourself as a first step and note that you did so.

---

## Ground rules

- **24–72 hours calendar time; ~one focused day of work expected.** Track your time honestly and report it.
- **AI tools encouraged.** Keep notes for `AI_NOTES.md` and the live review.
- **Any language/stack you're fluent in.** Pick what lets you do your best work. We're stack-agnostic.
- **Scope is yours.** There is no hidden "correct" feature set. Show me your line-drawing.
- **Build for the live review.** You'll walk me through this and defend it.

---

## What we're looking for (so you can aim well)

- You turned a vague, high-stakes request into a coherent system, surfacing the *right* hidden questions and making defensible calls.
- Your design choices are reasoned, not reflexive — you can argue the other side of your own decisions.
- You treated "how do we know it works?" as a first-class engineering problem.
- You used AI as a creative accelerant, not a crutch, and can speak to where it helped and where it didn't.
- You were honest about limits and clear about what you'd do next.

## What I am *not* looking for

- Maximum features or a production-grade system. Coherence and judgment beat surface area.
- A perfect answer. The problem is ambiguous on purpose; there isn't one.
- Polished UI, deployment, or infrastructure I didn't ask for.

---

## The live review (what to expect)

After you submit, we'll schedule **45 minutes** to go through the project together. We'll ask you to:

- Walk us through the system and the **design choices** behind it — and defend them.
- Tell us what you found **easy and what you found difficult**, and why.
- Tell us **what you'd do with more time**, and how you'd prioritize.
- Talk about **how you used AI** — where it was a genuine accelerant and where it got in the way.

Come ready to go deep on the parts you're least certain about. I am not looking to catch you out; I am looking to see how you think when someone pushes on your work. The strongest candidates get *more* interesting under that pressure.

I am excited to see what you build. Good luck.
Omoju
