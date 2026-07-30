# Issue-Ops Challenges — GitLab MCP + Agents + Copilot

> **Audience:** Experienced Copilot users familiar with agents, MCP, and instructions.
> These challenges are deliberately open-ended. There is no single correct answer.
> You are expected to explore, break things, and build beyond what exists.

---

## Challenge 1 — Triage Without Being Told How


The project has multiple open GitLab issues. You have no ranked list, no priority labels, and no instructions on what matters most.

**Your challenge:**
Using only Copilot and the GitLab MCP, produce a **prioritised implementation roadmap** for the `vans23/taskmanager-copilot-lab` project. Your roadmap must:

- Rank all open issues from most to least urgent
- Justify each ranking using evidence from the issue description AND the codebase (not just labels)
- Identify any issues that have **dependencies** on each other and group them accordingly
- Flag any issue that appears to be missing acceptance criteria or is too vague to implement safely

**Constraint:** You may not manually read the issues yourself first. Let Copilot fetch and reason about them.

**Stretch:** Post your roadmap as a comment on the highest-priority issue using the GitLab MCP.

---

## Challenge 2 — Make the Feature Planner Smarter

The `@feature-planner` agent generates a plan and creates a GitLab issue. But it has a gap: it never estimates **complexity or effort**, and it never checks whether a similar feature already exists in the codebase before generating a plan.

**Your challenge:**
Modify `.github/agents/feature-planner.agent.md` so that the agent:

1. **Before generating the plan** — searches the codebase and existing GitLab issues to detect if a similar feature already exists or is in progress. If it finds one, it must surface it and ask the user whether to proceed or link to the existing work instead.
2. **Inside the plan** — adds a new `## Effort Estimate` section that classifies the feature as `XS / S / M / L / XL` with a rationale based on number of files affected, whether backend changes are needed, and test surface area.
3. **When creating the GitLab issue** — includes the effort estimate as a label (e.g. `size/M`) on the issue.

**Constraint:** Do not change the approve/revise loop behaviour. Only extend what's already there.

**Validate:** Run `@feature-planner Plan a priority filter for the task list` and confirm all three additions appear correctly.

---

## Challenge 3 — Implement an Issue the Engineering Agent Has Never Seen


Pick **any open issue** from the GitLab project that was NOT used in the demo. If no suitable issue exists, create one yourself using the Feature Planner first.

**Your challenge:**
Invoke `@Engineering` on your chosen issue. But here's the constraint:

**The Engineering agent must not proceed past Step 2 without your explicit approval of its todo list.**

Currently the agent says *"Present the todo list to the user and proceed — do not wait for further confirmation."* That's a problem for complex features — you want a human checkpoint before code is written.

You must:
1. Modify the Engineering agent so it **pauses after presenting the todo list** and waits for the user to type `proceed` before starting implementation.
2. Then invoke it on your chosen issue and approve the todo list.
3. Let it implement and run tests.
4. If the Review agent sends it back with `❌ CHANGES REQUIRED`, fix the issues and complete the loop.

**Validate:** The Engineering agent must not write a single file until you have typed `proceed`.

---

## Challenge 4 — Break the Review Agent, Then Fix It

The Review agent checks code against a checklist. But checklists only catch what they list.

**Part A — Find the gap:**
Introduce a deliberate violation into any existing component that the Review agent's current checklist would **miss** — something that is genuinely bad code but not covered by any of the current checklist items. Examples might include: a memory leak, an unhandled promise rejection, an accessible name that passes the aria-label check but is still meaningless, or a backend endpoint that validates input but logs it unsanitised.

Invoke `@review` and confirm it does NOT catch your violation.

**Part B — Fix the checklist:**
Add the missing check to `.github/agents/review.agent.md` under the most appropriate section. The check must be specific enough to catch your violation but general enough to be useful for future code.

**Part C — Verify:**
Run the Review agent again. Confirm it now flags the violation with `[FAIL]`.

**Deliverable:** Be ready to explain what you found, why the existing checklist missed it, and how your addition closes the gap.

---

## Challenge 5 — Build the Auto-Assign Agent from Scratch

**No agent file exists for this. You build it from scratch.**

Design and implement an `.agent.md` that automatically assigns GitLab issues to the right person based on their labels and content.

**Requirements your agent must satisfy:**

- Given a list of open, unassigned issues in `vans23/taskmanager-copilot-lab`, the agent analyses each issue and assigns it to the most appropriate team member based on:
  - Labels (`frontend`, `backend`, `feature`, `bug`, etc.)
  - Keywords in the issue description (e.g. "C#", "React", "CSV", "database")
  - Logical rules you define in the agent's instructions
- The agent must explain its assignment reasoning for each issue before calling the GitLab MCP tool
- The agent must **not** reassign issues that already have an assignee
- The agent must handle the case where it cannot confidently determine an assignee (output `[UNASSIGNED — needs human review]` instead of guessing)

**Team mapping you define** (make up realistic roles for the `vans23` account and any other users you find on the project):

```
Define your own assignment rules in the agent — e.g.:
  - Issues labelled `frontend` → assign to frontend developer
  - Issues labelled `backend` → assign to backend developer
  - Issues labelled `bug` with keywords "crash" or "null" → assign to most senior
```

**Constraint:** The agent must use `mcp_gitlab_create_issue` or the assignment API — not just output a list. It must actually call GitLab.

**Stretch:** Make the agent post a comment on each assigned issue explaining why it was assigned to that person.

---

## Challenge 6 — The Full Autonomous Pipeline, No Hand-Holding

This challenge combines everything. No step-by-step instructions are given.

**Your objective:**
Start from a blank feature idea. End with a merged (or MR-ready) GitLab issue, implemented in code, reviewed, and traceable end-to-end.

**Rules:**
1. You must use at least **three different agents** from the `.github/agents/` folder
2. The feature must touch **both frontend and backend** (it cannot be frontend-only like the CSV export)
3. Every agent handoff must happen automatically — you may only type two things manually: the initial feature description, and `approve` to create the GitLab issue
4. The final MR description in GitLab must contain: the original plan file reference, the review verdict, and the test results
5. The entire session must be completable without leaving VS Code

**You are judged on:**
- Whether the pipeline ran without unplanned interruptions
- Whether the generated code passes all tests on first run (or how quickly failures were resolved)
- Whether the GitLab MR is correctly linked to the issue
- Whether any agent called the wrong GitLab tool at any point (e.g. `create_or_update_file` instead of `create_issue`)

**There is no template. Plan your approach before you start.**