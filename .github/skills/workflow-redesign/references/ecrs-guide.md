# ECRS Guide

## 목적과 순서

ECRS는 현재 Workflow 자체를 개선하기 위한 첫 단계다. Allocation이나 AI 후보 탐색보다 먼저 수행한다. 관련 Task와 Opportunity/Problem/Root Cause를 연결하고, Evidence와 Constraint를 확인한 뒤 각 항목을 순서대로 검토한다.

각 Task에 `ELIMINATE`, `COMBINE`, `REARRANGE`, `SIMPLIFY`, `KEEP` 중 하나 이상을 기록한다. 모든 E/C/R/S 칸을 억지로 채우지 말고 관련이 없으면 `N/A`로 표시한다.

## E — Eliminate

가장 먼저 Task가 필요한지 검토한다.

- 최종 목적 달성에 이 Task가 꼭 필요한가?
- 하지 않아도 Output, 품질, 통제 목적을 달성할 수 있는가?
- 중복되었거나 관행적으로 남아 있는 업무인가?
- 제거했을 때 어떤 오류·보안·정책·책임 Risk가 생기는가?

Task를 제거하는 경우 `ELIMINATE`와 근거, 영향 및 남는 통제를 기록한다. 사용자 동의 없이 제거하지 않는다. 제거만으로 Opportunity가 해결된다면 더 많은 자동화나 AI를 찾지 않는다. 결과는 `PROCESS IMPROVEMENT ONLY`일 수 있다.

## C — Combine

- 서로 연관된 Task를 합칠 수 있는가?
- 같은 정보를 여러 번 수집하거나 확인하는가?
- 여러 사람이 유사한 작업을 반복하는가?
- Handoff를 줄이기 위해 Task를 결합할 수 있는가?

결합 후보가 있으면 합치는 이유, 필요한 입력·책임자, 변경 후 Risk를 기록한다. 업무상 분리되어야 하는 승인·통제는 편의만으로 합치지 않는다.

## R — Rearrange

- 순서를 바꾸면 Wait Time 또는 Rework를 줄일 수 있는가?
- 독립된 Task를 병렬 수행할 수 있는가?
- 늦게 발견되는 오류를 앞 단계에서 확인할 수 있는가?
- 승인이나 검토 시점을 바꾸는 것이 타당한가?

선행조건, Handoff, Decision, 예외 경로를 보존하고, 변경이 처리 순서·통제에 미치는 영향을 설명한다.

## S — Simplify

- 입력정보를 줄이거나 표준화할 수 있는가?
- 판단기준을 명확히 할 수 있는가?
- 양식·절차·Handoff를 단순화할 수 있는가?
- 복잡한 Task를 간단한 Rule로 바꿀 수 있는가?

표준화나 기준 변경을 제안하면 실제로 정할 수 있는 주체와 필요 근거를 확인한다. 사용자가 확인하지 않은 규칙을 새 기준처럼 만들지 않는다.

## ECRS 기록 형식

각 행에 다음을 포함한다.

| Field | 기록 내용 |
|---|---|
| Task ID | 상류 Task ID 유지 |
| Current Task | As-Is 작업 |
| Related Problem / Root Cause | Stage 5 ID 유지 |
| Eliminate / Combine / Rearrange / Simplify | 판단 또는 `N/A` |
| Final ECRS Decision | 위 결정 enum 중 적용 항목; 변경이 없으면 `KEEP` |
| Rationale | Evidence, Constraint, Risk를 포함한 이유 |

## Simplified Workflow Draft

ECRS 적용 후, Allocation 전에 간소화된 흐름을 작성한다. 주요 Task, Decision, Handoff, Wait, Loop, Exception 및 End를 필요한 만큼 포함하고 As-Is에서 무엇이 바뀌는지 표시한다.

1. 변경안을 사용자에게 보여준다.
2. 제거·결합·순서변경·단순화의 근거와 Risk를 설명한다.
3. 사용자가 확인하거나 수정할 때까지 To-Be Allocation으로 넘어가지 않는다.
4. ECRS만으로 문제가 충분히 해결되면 그 지점에서 종료해도 된다.

기존 Task 재배치만으로 Opportunity를 다루기 어렵거나 신규 서비스·경험이 필요한 경우에 한해 ECRS 뒤에 Ideation을 수행한다. 아이디어는 해결할 Opportunity와 Root Cause에 연결하고, 제안 상태 `PROPOSED`로 둔다.
