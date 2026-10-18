# Evaluation and Test Guide

Prototype을 한 가지 편리한 사례만으로 평가하지 않는다. Acceptance Criteria와 연계된 Test Scenario를 구성하고 실행 가능한 Test만 실제 수행한다.

## Test Scenario 유형

업무에 필요한 경우 다음 유형을 포함한다.

- **Normal Case:** 일반적인 정상 업무
- **Boundary Case:** 판단 경계에 가까운 사례
- **Exception Case:** 예외 처리 필요
- **Failure Case:** 입력 누락·오류·접근 실패
- **High-risk Case:** 업무에서 위험이 큰 사례

불필요한 유형은 생략하되 이유를 알 수 있게 한다. 가능하면 가상 또는 마스킹 데이터를 사용한다.

각 Test에는 `test_id`, `scenario`, `input`, `expected_behavior`, `related_ac`, `actual_result`, `result`, `evidence`, `issue`를 기록한다. `result`는 `PASS`, `FAIL`, `BLOCKED`, `NOT_TESTED` 중 하나다.

## AI Evaluation

AI가 Workflow의 핵심 결과를 생성하거나 판단하는 경우, Risk와 Acceptance Criteria에 맞는 최소 Evaluation을 수행한다. 필요한 항목만 선정한다.

- Accuracy
- Completeness
- Relevance
- Groundedness
- Consistency
- Format Compliance
- Hallucination
- Safety
- Human Acceptance

기준 데이터와 평가 방법을 명시하고, 한 번의 정상 사례를 일반화하지 않는다. Human Review가 필수라면 실제 Prototype 흐름에서 작동하는지 확인한다. 과도한 Evaluation Framework를 만들지 않는다.

## Failure 분석

`FAIL` 또는 핵심 AC 미충족 시 원인을 다음 중 하나로 분류하고 근거를 기록한다.

- `IMPLEMENTATION`
- `PROMPT/INSTRUCTION`
- `DATA`
- `KNOWLEDGE`
- `INTEGRATION`
- `DESIGN`
- `ACCEPTANCE_CRITERIA`
- `UNKNOWN`

실패를 숨기거나 PASS로 재분류하지 않는다. Design 문제라면 `BACK_LOOP_REQUIRED: workflow-redesign`을 기록한다. Prototype 내부에서 해결 가능한 문제는 `ITERATE` 및 재시험으로 처리한다.

## Build Decision

| Status | 판단 기준 |
|---|---|
| `READY_FOR_PILOT` | 핵심 MUST AC가 충족되고 Pilot 조건·통제가 준비됨 |
| `ITERATE` | 가설과 설계 방향은 유효하나 Prototype 수정·재시험 필요 |
| `REDESIGN_REQUIRED` | 실패가 To-Be Workflow/Allocation에 기인해 Stage 6 재검토 필요 |
| `BLOCKED` | 자원, 권한, Data, 접근 또는 환경 제약으로 검증 불가 |
| `STOP` | 가설이 성립하지 않거나 추가 Build의 가치가 낮음 |

Test가 실행되지 않았다면 Test 성공을 주장할 수 없다. Decision의 이유, 미해결 조건, Issue, Back Loop 및 다음 행동을 기록한다.

## Business Impact 분리

Prototype Test가 보여주는 것은 Acceptance Criteria 충족 여부다. Prototype 성공을 생산성·비용·품질 개선의 확정된 효과로 표현하지 않는다. 실제 업무효과는 Stage 8에서 Baseline과 Pilot 결과를 비교해 검증한다.

`READY_FOR_PILOT`인 경우 Pilot 대상, 표본/Case 수, 기간, Baseline 비교, Metric, Risk, Human Control 및 Rollback 조건을 가능한 범위에서 준비한다. Build 단계에서 실제 Pilot을 수행하지 않는다.
