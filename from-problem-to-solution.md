# Go from Problem -> Solution

## Phase 1: Clarify the problem

Most people skip this and pay for it later.

Force clarity:

- What exactly are we solving?
- What does success look like?
- What are the constraints? (latency, scale, deadlines)
- What's explicitly out of scope?

From:

> "Improve performance"

To:

> "Reduce P95 latency from 800ms -> 200ms for endpoint X under 10k RPS"

If you don't do this, everything after is guesswork.

## Phase 2: Model the system

Before code, build a mental model or quick sketch:

- Inputs -> transformation -> outputs
- Data flow
- State and where it lives
- External dependencies

Questions to ask:

- Where can this break?
- What's the bottleneck?
- What scales poorly?

## Phase 3: Decompose into subproblems

Don't break thinks by tasks but by responsibilities and boundaries.

Look for:

- Natural boundaries

  - API Layer
  - Business logic
  - Data access
  - External integrations

- Independent units, Each piece should ideally:

  - Do one thing
  - Be testable in isolation
  - Be replaceable

- Order of execution
  
  - What must happen first?
  - What can be parallelized?
  - What block everything else?

### Simple framework:

- Core flow (happy path)
  - What's the simplest version that work
- Edge cases
  - Failures, retries, invalid input
- State Management
  - What data exists?
  - Where?
  - Who owns it?
- Interface
  - How components talk to each other
- Non-functional concerns
  - Performance
  - Reliability
  - Observability

If you can't break a problem using these, you don't understand it yet.

## Phase 4: Choose a strategy (not just a solution)

Don't ask:

> "What code do I write"

Ask:

> "What approach minimizes long-term cost?"

Evaluate tradeoffs:

- Build vs reuse?
- Sync vs async?
- Strong consistency vs eventual?
- Simplicity vs flexibility?
