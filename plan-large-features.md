# How to plan large features

## 1. Define the feature in one sentence

If you can't do this, you're not ready.

Example:

> "Allow users to upload videos and stream them globally with low latency"

## 2. Identify core capabilities

Break the feature into **capabilities**, not tasks

- Upload handling
- Storage
- Processing (encoding)
- Delivery (CDN/streaming)
- Metadata management

Theses are *building blocks*, not tickets

## 3. Define architecture (high level)

Sketch something like:

```
Client → API → Service → Storage
                  ↓
              Processing Queue → Workers
                  ↓
               CDN / Delivery
```

No details yet. Just structure.

## 4. Define contracts between components

This is where things get real.

- API schemas
- Event formats
- Data models

Example:

- "Upload service emits `VideoUploaded`"
- "Processing service consumes it"

Clear contracts = parallel work + fewer integration bugs.

## 5. Sequence the work

Don't just list tasks, stage risk.

Build in this order:

1. Skeleton / end-to-end "thin slice"
2. Core functionality
3. Hard parts (scaling, edge cases)
4. Optimization

> Integration risk kills projects, not missing features

## 6. Identify risks early

Call out:

- Unknowns ("we've never handled this scale")
- External dependencies
- Performance bottlenecks

Then:

- Prototype risky parts early
- Avoid surprises late

## 7. Define observability upfront

Not optional.

- What metrics matter?
- What logs will we need?
- How do we debug failures?

Design for debugging before writing code.

## Practice

If you want to build this skill fast:

### 3–4 times per week (30–60 min)

Take a random problem:

- Design a rate limiter
- Build a chat system
- Design file upload service

Then force yourself to:

1. Write problem definition (5 min)
2. Draw system (10 min)
3. Decompose (15 min)
4. Identify risks (10 min)

No coding.

### At work

After coding something at work:

- Ask: *“How should I have designed this?”*
- Refactor mentally
- Compare approaches