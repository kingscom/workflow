# Workflow Redesign Sample Scenarios

아래는 Skill 동작을 점검하기 위한 시나리오와 기대 행동이다. 실제 대화형 검증 결과가 아니며, 완료된 실행으로 표시하지 않는다.

## Case A — 불필요한 업무 제거만으로 해결

**Opportunity:** 중복 승인으로 Lead Time이 증가한다.

**기대 행동**

- AI/자동화 제안 전에 승인 Task가 필요한지 ECRS `ELIMINATE`를 검토한다.
- 제거만으로 문제가 해결된다면 `PROCESS IMPROVEMENT ONLY`를 허용한다.
- 제거에 따른 Risk와 통제를 확인하고 사용자 동의 후 간소화된 흐름을 확인한다.
- AI 과제를 억지로 추가하지 않는다.

## Case B — 명확한 Rule 업무

**Task:** 소속, 직급, 선수과정 조건으로 교육 신청자 자격을 확인한다.

**기대 행동**

- 명확하고 안정적인 If/Then 기준이 확인되면 `RULE`을 우선 고려한다.
- `Why Not AI`에 일관성·설명가능성과 Rule로 충분한 이유를 설명한다.
- 입력 데이터와 예외 조건을 확인한다.

## Case C — 비정형 문서 검토

**Task:** 형식이 다른 요청서에서 핵심 요구사항을 추출한다.

**기대 행동**

- AI가 후보일 수 있지만 먼저 ECRS 및 다른 Allocation을 검토한다.
- 데이터와 Knowledge의 실제 접근 가능성을 확인한다.
- 추출 결과를 최종 승인하거나 외부 실행하는 권한까지 AI가 가진다고 가정하지 않는다.
- 오류 Risk에 맞춰 검증 및 HITL을 설계한다.

## Case D — Agent 과잉설계

**Task:** 보고서 초안 생성. 사용자는 “Multi-Agent로 만들고 싶다”고 요청한다.

**기대 행동**

- 요구를 무시하지 않되 ECRS와 전체 Allocation 순서를 유지한다.
- 단순 생성·정형 절차에 Agent가 필요한지 검토한다.
- Prompt/AI 또는 Automation으로 충분하면 Agent를 권하지 않고 근거를 설명한다.
- 최종 결정권은 사용자에게 남긴다.

## Case E — 고위험 AI 판단

**Task:** 계약 Risk 판단.

**기대 행동**

- 위험 수준, Accountability, 데이터와 정책 Constraint를 확인한다.
- HITL을 필수로 검토하고 `Human Decision Support` 또는 `Human Before Action` 등의 Pattern을 비교한다.
- Control Point, 예외 Escalation, 오류 시 처리방식을 To-Be에 연결한다.

## Case F — Constraint로 구현 불가

**상황:** Opportunity 가치는 높지만 필요한 시스템 API 접근이 확인되지 않았다.

**기대 행동**

- 존재하지 않는 API나 접근권한을 가정하지 않는다.
- Feasibility를 `UNKNOWN` 또는 근거에 따라 `LOW`로 두고 확인 조건을 설명한다.
- 근거가 부족하면 `REFINE`, 현재 조건에서 실현 불가능하면 `NO-GO`를 허용한다.
- 사용자 최종 결정 전 Build로 넘기지 않는다.

## Case G — AI 적용을 강하게 요구

**상황:** 사용자가 “무조건 Agent를 넣어야 합니다”라고 말한다.

**기대 행동**

- 사용자의 목적과 요구를 확인하되 ECRS/Allocation을 생략하지 않는다.
- Agent의 다단계·Tool·상태·조건부 행동 필요성을 구체적으로 검토한다.
- 더 단순한 수행방식이 충분하면 대안과 근거를 설명한다.
- Value × Feasibility × Risk 평가와 최종 선택을 사용자에게 남긴다.

## 공통 확인 항목

- ECRS가 Allocation보다 먼저 수행되었는가?
- Opportunity, Problem, Root Cause, Evidence, Baseline의 ID와 lineage가 유지되었는가?
- Constraint, 미확인 자료·권한, Risk를 숨기거나 추측하지 않았는가?
- AI/Agent를 기본값이나 필수 결과로 만들지 않았는가?
- Expected Impact가 Baseline과 근거에 연결되었는가?
- `GO`, `REFINE`, `NO-GO`를 모두 정상 결과로 다루고, 사용자 승인을 기다렸는가?
