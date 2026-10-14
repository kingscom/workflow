# Workflow Diagnose Sample Session and Test Cases

These examples test Stage 5 coaching behavior. They are not evidence about a user's actual workflow.

## Representative Session

**Map input:** An approval wait is recorded as 2.5 days and total Lead Time as 3 days, both `ESTIMATED`. Map records an approval node but does not establish why it waits.

**Assistant:** "Map 초안에는 승인 Wait가 약 2.5일, 전체 Lead Time이 약 3일로 모두 `ESTIMATED`로 기록되어 있습니다. 승인 대기가 주요 병목이라는 해석은 아직 `HYPOTHESIS`입니다. 최근 실제 사례에서 승인 요청 후 어떤 일이 있었는지부터 확인해도 될까요?"

**User:** "요청 정보가 빠져서 승인 담당자가 다시 물어보는 경우가 있었어요."

**Assistant:** "그 추가 확인이 최근에도 반복됐나요? 기억나는 사례의 수나 요청서·메일에서 확인할 수 있는 흔적이 있나요?"

Assistant records only confirmed observations and keeps the cause candidate unvalidated until evidence is checked. It does not suggest a form, agent, or automation.

## Case A — Approval Wait

**Input:** Approval Wait Time `2.5 days [ESTIMATED]`; total Lead Time `3 days [ESTIMATED]`.

**Expected behavior:** Treat values as observations with estimation status; mark bottleneck interpretation as `HYPOTHESIS`; ask what caused the wait and whether actual cases support it; do not propose an approval solution.

## Case B — Report Rework

**Input:** User reports 4 of the latest 10 reports were revised. Departments submitted different formats.

**Expected behavior:** Preserve source/period and verify numerator/denominator; distinguish observed rework from the Problem's work impact; treat non-standard format as a cause candidate until artifacts/cases validate it; create a solution-neutral opportunity only after review; do not suggest a report Agent.

## Case C — Challenge a Personal Attribution

**User:** "사람들이 일을 늦게 해서 문제예요."

**Expected behavior:** Do not adopt this as Root Cause. Ask for recent examples, observable wait/hand-off evidence, counterexamples, and process conditions. Avoid blame and avoid inventing a process-level cause.

## Case D — Weak Numeric Estimate

**User:** "아마 절반 정도가 재작업일 거예요."

**Expected behavior:** Do not label this `VERIFIED` or `MEASURED`. Preserve it as a user estimate/report with source and uncertainty, then propose a specific data or case validation plan if material.

## Case E — Solution-First Request

**User:** "여기 Agent를 넣으면 될 것 같아요."

**Expected response:** "가능한 아이디어로 별도 보존하겠습니다. 현재 Diagnose에서는 먼저 어떤 문제와 원인이 실제로 확인되는지 살펴보겠습니다."

**Expected behavior:** Optionally add the idea to `solution_parking_lot` as `NOT_EVALUATED`. Do not evaluate AI suitability or include the idea in Opportunity wording.

## Case F — No Significant Opportunity

**Input:** Map and user review reveal no meaningful pain or performance impact within the target scope.

**Expected behavior:** Do not fabricate a problem. Return `no_significant_opportunity: true`, preserve any unresolved questions, and explain the evidence/scope limit.

## Validation and Traceability Check

For every opportunity in the output, trace:

```text
Work ID → Task ID / Decision ID → Node ID → Observation → Problem ID → Root Cause ID → Opportunity ID → Baseline
```

Verify that unvalidated hypotheses have a validation plan/backlog item, constraints are separate, and the Handoff contains no unreviewed solution as a recommendation. These examples specify expected behavior only; they do not claim an interactive test was executed.
