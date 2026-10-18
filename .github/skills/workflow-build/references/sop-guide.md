# Executable SOP Guide

SOP는 To-Be Workflow를 사람이 실제로 실행하거나 Prototype과 함께 검토할 수 있는 작업 지시 수준으로 표현한다. 설명문만으로 끝내지 않고 Trigger부터 완료 조건까지 명시한다.

## SOP 구성

SOP 전체에 목적, Trigger, Preconditions, 필요한 Input, Output, 예외·Escalation 경로, Control Point 및 Completion Condition을 포함한다. 각 Step은 Stage 6 To-Be Node를 추적할 수 있어야 한다.

| Field | 내용 |
|---|---|
| `step_id` | 고유 SOP Step ID (예: `S01`) |
| `related_to_be_node` | Stage 6 To-Be Node ID |
| `actor` | Human, Rule, System, Automation, AI 또는 Agent 등 수행자 |
| `action` | 실행 가능한 동작 |
| `input` | 필요한 정보·자료 및 출처 |
| `tool_system` | 실제 확인된 Tool/System. 미확인은 `UNKNOWN` |
| `rule_instruction` | 적용할 기준·지시 |
| `expected_output` | 검증 가능한 결과 |
| `decision` | 분기 조건과 다음 Step |
| `exception` | 예외 신호 및 처리 |
| `escalation` | 담당자/역할과 인계 조건 |
| `control` | 승인, 검증, 로그 등 필요한 통제 |

관련 없는 필드는 `N/A`로 둘 수 있다. 근거 없는 역할, 정책, 권한 또는 SLA를 만들지 않는다.

## 실행 가능성 및 통제

- Step 순서는 To-Be의 실행 순서를 유지하고 Decision, Handoff, Wait, Loop 및 Exception을 표현한다.
- 입력 누락, 잘못된 형식, 접근 불가, 낮은 신뢰도, 외부 Action 실패 등 실제 관련 예외를 정의한다.
- 승인·거절·데이터 변경·외부 Action·고위험 판단은 Stage 6의 HITL 및 Control을 유지한다.
- SOP가 To-Be Node와 맞지 않거나 Allocation 변경이 필요하면 `BACK_LOOP_REQUIRED: workflow-redesign`을 기록한다.
- AI/Agent는 승인받지 않은 외부 실행을 하지 않는다. 실제 실행 권한과 환경을 확인하고 Mock과 실제 Tool을 구분한다.

## Traceability

각 Step에 To-Be Node ID를 연결하고 가능한 경우 Opportunity, Root Cause 및 As-Is Task lineage를 보존한다. Handoff에서 `To-Be Node → SOP Step → Acceptance Criteria → Test`를 역추적할 수 있어야 한다.
