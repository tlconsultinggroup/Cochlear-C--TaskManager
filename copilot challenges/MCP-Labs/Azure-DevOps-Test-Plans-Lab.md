# Azure DevOps Test Plans with MCP and GitHub Copilot

## Lab Overview

This participant lab uses GitHub Copilot Agent mode and an organization-provided Azure DevOps MCP server to turn one work item into traceable Test Plans coverage.

The lab covers the full workflow:

- Create a work item and extract its acceptance criteria
- Create or update a test plan and suite
- Create manual test cases with meaningful steps and expected results
- Execute cases and publish results or evidence
- Link an intentional failure to a defect
- Audit traceability and produce a delivery summary

> **Important:** This repository does not define the organization’s ADO MCP server. Replace every `<verified-tool-name>` placeholder with the exact tool name and parameter shape returned by your live MCP server. Do not infer tool names from this document.

## Learning Outcomes

By the end of this lab, participants will be able to:

- Create a well-formed Azure DevOps work item with reviewed acceptance criteria
- Discover and validate an organization-provided MCP server in Copilot Agent mode
- Convert acceptance criteria into a requirement-to-test matrix
- Create structured Azure DevOps Test Plans artifacts with Copilot
- Maintain links between work items, test cases, runs, results, and defects
- Inspect proposed write payloads before approving them
- Recover from a failed or partial MCP operation without creating duplicates
- Summarize test coverage, execution evidence, and residual risk

## Scenario

Use one disposable or instructor-owned Azure DevOps project. Participants create the work item themselves in Lab Step 1, then reuse its ID for every remaining step.

Feature: **Task categories**

- Users can assign a category to a task.
- Only approved category values are accepted.
- Invalid values produce a validation error.
- Existing task creation and listing behavior continues to work.

The work item created in Lab Step 1 must contain at least four acceptance criteria covering the behaviors above.

Use placeholders in the prompts:

- `<organization>`
- `<project>`
- `<work-item-id>` — captured after the work item is created in Lab Step 1
- `<plan-name>`
- `<suite-name>`
- `<area-path>`
- `<iteration-path>`

## Target Artifacts

| Artifact | Purpose |
|---|---|
| Work item | Source requirements and acceptance criteria; created by the participant in Lab Step 1 |
| Test plan | Container for the feature’s test coverage |
| Test suite | Groups cases for the selected feature or iteration |
| Manual test case | Documents preconditions, steps, expected results, priority, and tags |
| Test run/result | Records execution outcome and evidence |
| Defect | Tracks an intentional failed scenario and its relationship to the work item/case |

## Acceptance Criteria

- The participant creates the target work item through MCP with a reviewed payload and at least four acceptance criteria.
- Every acceptance criterion maps to at least one test case.
- The suite contains one happy-path case and at least three edge-case cases.
- Every case has a title, priority, preconditions, steps, expected results, and tags.
- Every case is linked to the originating work item.
- At least one passing and one failing result are recorded.
- The intentional failure is linked to a defect or documented ADO fallback.
- The created artifact IDs can be retrieved after creation.
- A retry or recovery does not create duplicate plans, suites, cases, or defects.
- The final summary identifies coverage, execution status, open defects, and residual risk.

## Prerequisites

- VS Code with GitHub Copilot enabled
- Copilot Agent mode available
- Access to the organization’s configured ADO MCP server
- Permission to read work items and Test Plans
- Instructor-approved permission to create or update test artifacts in the target project
- A disposable or instructor-owned ADO project, area path, and iteration path
- Permission to create a work item in the target project
- The organization’s MCP server documentation or a facilitator who can confirm tool behavior

Do not use production test plans or real customer data for this lab.

## Live MCP Tool Contract

Complete this table during setup from the live MCP discovery response.

| Capability | Verified organizational tool name | Required inputs | Expected output | Risk | Fallback |
|---|---|---|---|---|---|
| Create work item | `<verified-tool-name>` | Organization, project, area/iteration path, title, description, acceptance criteria | Work item ID | Write | ADO work item UI |
| Retrieve work item | `<verified-tool-name>` | Organization, project, work-item ID | Work item fields and links | Read | ADO work item UI |
| List test plans/suites | `<verified-tool-name>` | Project and optional filters | Plan/suite IDs and names | Read | ADO Test Plans UI |
| Create/update plan or suite | `<verified-tool-name>` | Project, name, area/iteration context | Created artifact ID | Write | ADO Test Plans UI |
| Create/update test case | `<verified-tool-name>` | Title, steps, expected results, tags, links | Test case ID | Write | ADO Test Case UI |
| Link case to work item | `<verified-tool-name>` | Case ID and work-item ID | Link confirmation | Write | ADO Links tab |
| Publish run/result | `<verified-tool-name>` | Case IDs, outcome, evidence | Run/result ID | Write | ADO Test Runs UI |
| Create/link defect | `<verified-tool-name>` | Failure details, case/run/work-item IDs | Defect ID and links | Write | ADO Boards UI |
| Retrieve created artifacts | `<verified-tool-name>` | Artifact IDs | Current artifact state | Read | ADO artifact pages |

For every write operation, Copilot must show the proposed target project, payload, and intended relationships before you approve it.

## Lab Step 1: Create the Work Item for Task Categories

**Goal:** Create the source work item that will drive every remaining step, instead of starting from a pre-existing one.

Prompt:

```text
In Agent mode, list the Azure DevOps MCP tools available in this workspace and identify which one creates a work item. Show its required inputs, target project, and confirmation behavior. Do not create anything yet.
```

Prompt:

```text
Prepare a write plan to create a work item in organization <organization>, project <project>, area path <area-path>, and iteration path <iteration-path> for the Task categories feature:
- Users can assign a category to a task.
- Only approved category values (work, personal, urgent) are accepted.
- Invalid category values are rejected with a validation error.
- Existing task creation and listing behavior continues to work.
Draft a title, description, and at least four acceptance criteria covering the behaviors above. Show the full proposed payload before creating anything.
```

After reviewing the proposed payload, approve the write, then verify it:

```text
Retrieve the work item just created. Confirm its title, description, and acceptance criteria, and report the work item ID.
```

Checkpoint:

- The work item was created only after you reviewed the proposed payload.
- The work item contains at least four clear, testable acceptance criteria.
- The returned work item ID is recorded and will be used as `<work-item-id>` for every remaining step.

## Lab Step 2: Confirm the Work Item and Test Plans Context

**Goal:** Confirm Copilot can reach the correct ADO project and see the work item you just created, alongside any existing Test Plans context.

Prompt:

```text
Using only read operations, retrieve work item <work-item-id> from organization <organization> and project <project>. Then list the existing test plans and suites in that project. Do not create or update anything.
```

Checkpoint:

- The organization and project are correct.
- The work item created in Lab Step 1 is retrieved with its acceptance criteria intact.
- The exact tool names and parameters are recorded in the tool contract.
- No write operation was attempted.

## Lab Step 3: Derive Test Coverage

**Goal:** Convert the work item into a reviewable test design before creating ADO artifacts.

Prompt:

```text
Read work item <work-item-id> and create a requirement-to-test matrix without changing Azure DevOps. Include one test intent for every acceptance criterion, one happy-path case, and at least three edge cases. For each proposed case include title, priority, preconditions, steps, expected results, tags, and the requirement it covers. Identify ambiguity or missing acceptance criteria before suggesting writes.
```

Checkpoint:

- Every acceptance criterion has coverage.
- At least three meaningful edge cases are present.
- Steps are observable and expected results are unambiguous.
- The matrix is approved before any case is created.

## Lab Step 4: Create the Plan, Suite, and Cases

**Goal:** Create a small, structured Test Plans hierarchy with traceable cases.

Prompt:

```text
Using the approved requirement-to-test matrix, prepare a write plan for Azure DevOps project <project>:
1. Reuse test plan <plan-name> if it already exists; otherwise propose creating it.
2. Reuse suite <suite-name> if it already exists; otherwise propose creating it under the selected plan.
3. Create only the approved manual test cases.
4. Set area path <area-path> and iteration path <iteration-path> where supported.
5. Link every case to work item <work-item-id>.
6. Show all proposed IDs, payloads, and relationships before executing writes.
Pause for confirmation before each group of writes.
```

After approval, verify the returned IDs with a read-only prompt:

```text
Retrieve the plan, suite, and test cases just created. Confirm their names, steps, expected results, tags, priorities, and links to work item <work-item-id>. Report any mismatch without changing data.
```

Checkpoint:

- Existing artifacts were reused where appropriate.
- No duplicate cases were created.
- All case fields and work-item links are present.
- IDs are captured for the next step.

## Lab Step 5: Execute and Publish Evidence

**Goal:** Record both a successful result and an intentional failure.

Prompt:

```text
Using the verified test case IDs, prepare a test run for <plan-name> and <suite-name>. Mark the happy-path case as Passed with concise execution evidence. Mark the selected edge case as Failed using this controlled defect: <failure-description>. Show the proposed outcomes, evidence, and run scope before publishing. Do not publish until I confirm.
```

If the MCP server supports result publication, approve the write and retrieve the run. If it does not, use the documented ADO UI fallback and record the run/result IDs in your notes.

Prompt:

```text
Create or link a defect for the controlled failure. Include the failing case ID, run/result ID, work-item ID, expected behavior, observed behavior, and reproduction steps. Show the proposed defect payload and links before writing.
```

Checkpoint:

- At least one result is Passed and one is Failed.
- Evidence is concise and tied to the case.
- The failure is linked to a defect or its fallback artifact.
- Run, result, and defect IDs are captured.

## Lab Step 6: Audit Traceability and Quality

**Goal:** Use Copilot to find gaps before closing the work.

Prompt:

```text
Audit the Azure DevOps artifacts for work item <work-item-id>. Check bidirectional traceability between the work item, test plan, suite, test cases, run/results, and defect. Report:
- Acceptance criteria without test coverage
- Test cases without a requirement link
- Missing preconditions, steps, expected results, priority, or tags
- Duplicate or near-duplicate cases
- Results without evidence
- Failures without a defect or disposition
Do not modify anything.
```

Checkpoint:

- The audit has no unaddressed critical gaps.
- Any intentional gaps are documented as residual risk.
- The relationships can be followed from the work item to evidence and back.

## Lab Step 7: Recover from a Controlled Failure

**Goal:** Practice safe diagnosis and idempotent recovery.

Use one controlled failure, such as an invalid project identifier, missing permission, malformed test step, or interrupted write.

Analysis prompt:

```text
A write operation for the ADO Test Plans workflow failed. Explain the error, identify whether any artifact may have been created, and propose a read-only verification sequence. Do not retry or create anything yet.
```

Recovery prompt:

```text
Run the proposed read-only verification. If the intended artifact already exists, reuse it and do not create a duplicate. If it does not exist, show the corrected payload and target before requesting confirmation for one retry. Summarize the final artifact state.
```

Checkpoint:

- The failure is understood rather than blindly retried.
- Existing artifacts are reused.
- No duplicate artifact was introduced.
- The final state is retrievable.

## Lab Step 8: Review and Close

**Goal:** Produce a concise delivery record.

Prompt:

```text
Create a final Azure DevOps Test Plans summary for work item <work-item-id>. Include:
- Plan, suite, test case, run, result, and defect IDs
- Acceptance-criteria coverage
- Passed and failed outcomes
- Evidence and links created
- Open defects and owners if available
- Residual risk and recommended next action
- Cleanup or rollback actions for this disposable lab data
Do not claim an artifact exists unless it was verified through ADO or the MCP read operation.
```

## Completion Criteria

- [ ] Work item was created for Task categories with a reviewed payload and at least four acceptance criteria.
- [ ] MCP tools and permissions were verified.
- [ ] Target work item was retrieved and confirmed after creation.
- [ ] Requirement-to-test matrix was reviewed.
- [ ] Test plan and suite were reused or created.
- [ ] Happy-path and three edge-case cases were created or verified.
- [ ] Cases contain complete manual steps and expected results.
- [ ] Cases link to the source work item.
- [ ] Passed and failed results were recorded.
- [ ] Failure was linked to a defect or documented fallback.
- [ ] Traceability audit was completed.
- [ ] Recovery test completed without duplication.
- [ ] Final summary includes IDs, evidence, open risk, and cleanup.

## Facilitator Notes

- Populate the tool contract from the live organization MCP server before the session.
- Confirm participants have permission to create a work item in the target project before the session.
- Use a disposable project or instructor-owned area with predictable permissions.
- Keep all write operations confirmation-based so participants can inspect payloads.
- Prepare one controlled failure and know whether it can produce a partial artifact.
- If result or defect writes are unsupported, demonstrate the documented ADO UI fallback and retain the traceability objective.
- Ask participants to distinguish Copilot’s proposed test design from verified ADO state.

## Troubleshooting

| Problem | Response |
|---|---|
| MCP tools are unavailable | Confirm Agent mode, MCP enablement, server connection, and reload VS Code. Ask the facilitator for the organization setup. |
| Work item creation fails | Verify organization, project, area/iteration path, and create permission. Check whether a partial item was created before retrying. |
| Work item cannot be read | Verify organization, project, ID, identity, and read permission. Do not guess a different project. |
| Write is denied | Capture the error, check Test Plans permission, and use the UI fallback if approved. |
| Payload is rejected | Inspect the required fields and path values; correct one field at a time. |
| Operation may have partially succeeded | Perform read-only lookup by name/ID before retrying. |
| Duplicate appears after retry | Stop writes, record both IDs, and ask the facilitator which disposable artifact to retain. |
| Results or defects are unsupported | Use ADO UI for that operation and record the resulting IDs in the final summary. |

## Expected Deliverables

- Created work item ID with reviewed title, description, and acceptance criteria
- Completed requirement-to-test matrix
- MCP tool contract populated with verified names
- Captured IDs for plan, suite, cases, run/results, and defect/evidence
- Traceability audit output
- Final delivery summary
