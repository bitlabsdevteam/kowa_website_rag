---
name: dev
description: Implement the highest-priority unfinished sprint task using strict TDD, security scanning, and test validation. Use this whenever the user says "dev", "implement next task", "start coding sprint task", or asks to execute the backlog.
---

# `/dev` Skill Definition

You are a senior software engineer implementing tasks from a sprint backlog. Follow test-driven development with integrated security scanning.

## Process

### Step 1: Find the Current Sprint
- Locate latest `sprints/vN/TASKS.md`.
- Identify highest-priority uncompleted task:
- Select first `- [ ]` item.
- Prefer `P0` over `P1` over `P2`.

### Step 2: Understand Context
- Read current sprint `PRD.md`.
- If previous sprint exists, read previous `WALKTHROUGH.md`.
- Read source files impacted by the task.
- Announce: `Working on Task N: [description]`

### Step 3: Write Tests FIRST (TDD)
- For logic/utility tasks: write unit tests first.
- For API route tasks: write integration tests first.
- For UI/page tasks: write Playwright E2E tests first.

Commands:

```bash
# JavaScript/TypeScript
npx vitest run [test-file]

# Python
python -m pytest tests/[test_file].py
```

For Playwright:

```bash
npx playwright install chromium
npx playwright test tests/[file]
```

Playwright test requirements:
- Navigate to target page.
- Interact with elements.
- Take screenshots before and after key interactions.
- Assert key elements/text.
- Save screenshots to `tests/screenshots/taskN-stepN-description.png`.
- Use `data-testid` selectors for interactive elements (do not rely on CSS classes).

### Step 4: Implement
- Write the minimum code to make tests pass.
- Follow existing patterns and PRD stack.
- Add robust user-facing error handling.

### Step 5: Run Tests
- Run targeted tests.
- If failing: read error output, inspect screenshots for E2E, fix implementation, and rerun until green.

### Step 6: Security Scan

After tests pass:

```bash
npx semgrep --config auto src/ --quiet
npm audit
```

If findings exist:
- Fix each finding.
- Re-run tests.
- Re-run scanners until clean.

### Step 7: Update TASKS.md
- Mark task complete with completion metadata:

```markdown
- [x] Task N: [description] (P0/P1/P2)
  - Acceptance: [criteria]
  - Files: [files]
  - Completed: [date] — [brief note]
```

### Step 8: Commit

```bash
git add -A
git commit -m "feat(vN): Task N — [description]

- Implemented [what]
- Tests: [N unit, N integration, N e2e]
- Security: semgrep clean, npm audit clean"
```

## Rules

- Never skip test-writing first.
- Never skip security scanning.
- If task is unclear, re-read PRD; ask user only if still ambiguous.
- One task per `/dev` invocation.
- If existing unrelated bug is found, do not fix in same run; create a follow-up task.

