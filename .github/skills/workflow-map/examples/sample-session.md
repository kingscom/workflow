# Workflow Map Sample Session and Test Cases

These cases test Stage 4 structuring behavior. They are examples, not process instructions for unrelated real work.

## Representative Mapping Session

### Input

Stage 2 supplies a task tree for a recurring internal training workflow. Stage 3 supplies a decision map with topic-fit cues, a Go/Stop decision, survey thresholds, and a response-count exception. The Stage 1 target boundary runs from finding a topic candidate to recording survey results and notifying the team.

### Assistant Draft

```text
Trigger: A relevant external technical blog topic is found.
Start: Review the article and share it with the team.
Main flow: Team Go/Stop -> initial instructor contact -> online content/fit discussion -> curriculum exchange and refinement -> team review/feedback loop -> internal promotion -> event preparation -> lecture -> survey -> analysis -> Confluence record and team email -> End.
Conditional paths: Event setup varies by confirmed online/offline condition. Any other branch remains Unknown until verified.
Baseline: Monthly frequency is ESTIMATED from the user-reported pattern. Total elapsed time is ESTIMATED at about one month; touch and wait time remain UNKNOWN until separated.
```

The draft does not infer event order, responsible actors, wait durations, or a rejoin point where Stage 1~3 do not provide them. The coach asks the user to walk through a recent actual event and correct missing or out-of-order transitions before finalizing the map.

## Case A — Education Request and Audience Confirmation

**Input:** Decompose tasks include receiving an education request, checking prerequisites, confirming an audience with a team, and sending a response. Deep Dive includes an approval decision.

**Expected behavior:** Connect only evidenced tasks; show the confirmed approval/return branches; identify sender and receiver at a confirmed handoff; add a wait only when response waiting is stated. Do not invent a rejected-request process or redesign the approval route.

## Case B — Incident Response

**Input:** Several decisions, a confirmed urgent exception, and escalation to an on-call specialist exist.

**Expected behavior:** Map the normal route and urgent route separately; connect the escalation to the named actor and supplied information; include a return edge only if the actual process confirms it. Do not recommend a better incident flow.

## Case C — Report Preparation

**Input:** The user gathers data from multiple teams, waits for replies, revises the report, and sends it to a manager. No time log exists.

**Expected behavior:** Represent confirmed handoffs, waits, and rework loops; separate Touch Time from Wait Time; mark unavailable times `UNKNOWN` and propose a Measurement Plan only for meaningful metrics. Do not label the wait a bottleneck.

## Case D — Incomplete Decompose Result

**Input:** A task list exists, but important task order and decision connections are absent.

**Expected behavior:** Do not infer the end-to-end edges. Ask about the most consequential missing transition. If the Task Tree itself is too coarse or missing tasks, emit `BACK_LOOP_REQUIRED: workflow-decompose`; if important decision knowledge is missing, emit `BACK_LOOP_REQUIRED: workflow-deep-dive`.

## Case E — User Requests Redesign

**User:** "이거 보니까 메일 단계를 없애면 되겠네요. 없애주세요."

**Expected behavior:** Keep the current email step in the As-Is map. Explain briefly that Stage 4 records the current process; preserve the idea separately as a user-proposed future candidate only if requested. Do not remove the node, diagnose its value, or recommend automation.