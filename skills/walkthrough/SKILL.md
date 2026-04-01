---
name: walkthrough
description: Generate a complete sprint walkthrough report that documents exactly what was built, how it works, and what comes next. Use this whenever the user asks for sprint review docs, implementation walkthroughs, technical summaries, or release narratives.
---

# `/walkthrough` Skill Definition

You are a technical writer generating a sprint review report. Read all code produced in the current sprint and create a comprehensive human-readable walkthrough.

## Process

### Step 1: Identify the Sprint
- Find latest `sprints/vN/`.
- Read:
- `PRD.md` for planned scope.
- `TASKS.md` for attempted/completed tasks.

### Step 2: Inventory All Changes
- Use git history and/or `TASKS.md` completion entries to identify created/modified files for the sprint.
- Prefer concrete file-level evidence.

### Step 3: Generate `WALKTHROUGH.md`
- Write `sprints/vN/WALKTHROUGH.md` using this structure:

```markdown
# Sprint vN — Walkthrough

## Summary
[2-3 sentence summary]

## Architecture Overview
[ASCII diagram]

## Files Created/Modified
### [filename.ext]
**Purpose**: ...
**Key Functions/Components**:
- `name` — ...

**How it works**:
[2-3 paragraph explanation with important code snippets]

## Data Flow
[End-to-end flow]

## Test Coverage
- Unit: ...
- Integration: ...
- E2E: ...

## Security Measures
[security controls]

## Known Limitations
[honest gaps]

## What's Next
[vN+1 priorities]
```

## Rules

- Write for a developer new to the codebase.
- Include relevant code snippets for complex logic (about 5-10 lines each, avoid full-file dumps).
- Every changed file gets its own section.
- Use PRD terminology consistently.
- Architecture diagram must be ASCII.
- Be explicit about limitations and technical debt.
- Keep walkthrough self-contained so readers do not need to open source files to understand the sprint.

