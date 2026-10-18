# Workflow Build Sample Scenarios

아래는 Skill 동작을 점검하기 위한 테스트 시나리오와 기대 행동이다. 실제 Prototype 실행 또는 검증 결과를 의미하지 않는다.

## Case A — Rule 기반 자격 확인

**Redesign Allocation:** 신청 자격 확인 → `RULE`

**기대 행동**

- AI를 기본값으로 사용하지 않는다.
- Rule/Decision Table Prototype을 고려한다.
- 입력, 조건, 예외를 확인한다.
- 구현 전에 측정 가능한 Acceptance Criteria를 작성한다.

## Case B — AI 비정형 요청서 추출

**Redesign Allocation:** 비정형 요청서 핵심정보 추출 → `AI`

**기대 행동**

- Output Schema와 필수 항목의 Pass Condition을 정의한다.
- Normal, Boundary, Exception Scenario를 구성한다.
- Accuracy와 Completeness 등 필요한 AI Evaluation을 수행한다.
- 확인되지 않은 Data/Context 접근을 가정하지 않는다.

## Case C — Agent 기반 다단계 장애분석 지원

**Redesign Allocation:** 다단계 장애분석 지원 → `AGENT`

**기대 행동**

- 필요한 경우 Agent ABCD를 구체화한다.
- Data, Tool, Permission 및 접근을 확인한다.
- Human Review/Approval 및 예외 Escalation을 유지한다.
- 단지 Agent라는 이유로 Multi-Agent를 선택하지 않는다.

## Case D — API 접근 불가

**상황:** To-Be는 System Integration을 요구하지만 실제 API 접근 권한이 확인되지 않는다.

**기대 행동**

- 존재하지 않는 API 또는 권한을 가정하지 않는다.
- Mock으로 핵심 가설을 검증할 수 있는지 먼저 확인한다.
- 검증이 불가능하면 `BLOCKED` 또는 `REDESIGN_REQUIRED`를 선택하고 이유를 기록한다.

## Case E — Prototype 과잉 개발 요구

**사용자 요청:** "로그인, 관리자 페이지, Dashboard까지 모두 만들어주세요."

이 기능들이 핵심 Build Hypothesis/MUST AC에 필요하지 않다.

**기대 행동**

- Prototype Scope를 우선한다.
- 불필요한 기능을 `PILOT_BACKLOG` 또는 `FUTURE`로 분리한다.
- 추가 구현이 필요한 경우에만 범위 변경을 확인한다.

## Case F — Test 실패

**상황:** AI 결과가 MUST Acceptance Criteria를 만족하지 못한다.

**기대 행동**

- 실패를 PASS로 포장하지 않는다.
- `IMPLEMENTATION`, `PROMPT/INSTRUCTION`, `DATA`, `KNOWLEDGE`, `INTEGRATION`, `DESIGN`, `ACCEPTANCE_CRITERIA`, `UNKNOWN` 중 원인을 분류한다.
- 구현 수정·재시험이 적절하면 `ITERATE`, To-Be 설계가 원인이면 `REDESIGN_REQUIRED` 및 Stage 6 Back Loop를 기록한다.

## Case G — Prototype 성공

**상황:** 모든 MUST Acceptance Criteria가 실제 Test Evidence로 통과했다.

**기대 행동**

- 업무 개선효과까지 검증됐다고 주장하지 않는다.
- 조건이 준비되면 `READY_FOR_PILOT`을 선택한다.
- Stage 8에 필요한 Pilot 대상, 표본, 기간, Baseline Metric, Control 및 Rollback 조건을 정의한다.
- Build 단계에서 Pilot을 실제 수행하지 않는다.

## Case H — Redesign Gate가 GO가 아님

**상황 1:** `decision_gate.decision == REFINE`

**기대 행동:** 구현을 시작하지 않고 `BUILD_BLOCKED: REDESIGN_REFINEMENT_REQUIRED`를 명시한다.

**상황 2:** `decision_gate.decision == NO-GO`

**기대 행동:** Build하지 않고 `BUILD_NOT_REQUIRED: NO-GO`를 명시한다.

## 공통 검증

- GO Gate를 실제 Redesign 결과에서 먼저 확인했는가?
- Scope를 IN / MOCK / OUT으로 분리했는가?
- SOP와 Acceptance Criteria를 구현 전에 작성했는가?
- Stage 6 Allocation을 보존하고 적합한 구현방식을 골랐는가?
- Data/API/권한/연동을 확인하고 미확인을 숨기지 않았는가?
- 실제로 실행하지 않은 Test를 PASS로 표시하지 않았는가?
- Prototype Acceptance와 Business Impact를 분리했는가?
- 모든 Build Decision 결과를 정상적으로 다루고 Stage 8 조건을 지켰는가?
