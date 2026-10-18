# Human-in-the-loop and Control Guide

## HITL 적용 Gate

AI가 다음 중 하나를 수행하면 Human-in-the-loop(HITL)을 반드시 검토한다.

- 중요한 판단을 수행함
- 외부 Action을 수행함
- 데이터를 변경함
- 승인 또는 거절함
- 고객·직원에게 직접 영향을 주는 결과를 만듦
- 높은 Risk 결과를 생성함
- 되돌리기 어려운 실행을 함

HITL은 필요한 위험·판단 Task에만 설계한다. 모든 Task에 기계적으로 추가하지 않는다. AI를 사용하지 않는 Task에는 불필요한 HITL을 붙이지 않는다.

## HITL Pattern

| Pattern | 흐름 | 적합한 상황 |
|---|---|---|
| `Human Before Action` | AI 제안 → Human 승인 → 실행 | 실행 전 책임 있는 승인이 필요 |
| `Human After Action` | AI 실행 → Human 사후 검토 | 실행은 제한적으로 허용되나 결과의 사후 확인이 필요 |
| `Exception Escalation` | AI 자동 수행 → Confidence/Risk 조건에서 Human Escalation | 정상 경로와 예외 경로를 구분할 수 있음 |
| `Human Decision Support` | AI 분석·추천 → Human 최종 판단 | AI는 증거를 정리하지만 책임 있는 결정은 사람에게 있음 |

선택한 Pattern과 조건을 설명한다. Confidence Threshold나 Risk 기준을 사용자/정책이 제공하지 않았다면 임의의 수치를 만들지 말고 `UNKNOWN` 또는 결정 필요사항으로 기록한다.

## Control Point

To-Be Workflow에 실제 위험을 줄이는 데 필요한 통제점을 표시한다.

- Human Approval
- Validation
- Security Check
- Policy Check
- Data Quality Check
- Exception Escalation
- Audit Log

Control Point는 해당 Task의 Risk와 연결하고, 책임 주체·실행 위치·예외 처리를 가능한 범위에서 밝힌다. Risk가 없는 Task에 불필요한 승인을 추가하지 않는다.

## To-Be에 남길 정보

Allocation이 AI 또는 Agent이고 HITL이 필요하면 다음을 구체화한다.

- `required`: `true`
- `pattern`: 위 네 가지 Pattern 중 선택
- `condition`: 검토·승인·Escalation이 필요한 상황
- `control_points`: 데이터 품질·보안·정책·승인·감사 등 적용 통제

HITL이 필요하지 않다면 `required: false`로 두고 그 이유를 Risk 설명에 남긴다. 예외가 발생했을 때 업무가 중단되는지, 사람에게 인계되는지, 안전하게 되돌릴 수 있는지도 정의한다.

## 보안 및 책임

- 실제 비밀번호나 API Key를 요청·기록하지 않는다.
- 개인정보는 최소화하고, 실제 고객·프로젝트·시스템 식별정보는 필요 시 익명화한다.
- 접근권한, 외부 AI 사용 허용 여부, 보안정책을 임의로 가정하지 않는다.
- 보안·개인정보·규제·정책·책임 조건이 불명확하면 Constraint와 Gate의 `UNKNOWN`으로 남기고 확인이 필요한 주체를 명시한다.
- 높은 Risk라고 무조건 NO-GO로 하지 않는다. 통제와 HITL로 관리 가능한지 확인하고, 근거가 부족하면 REFINE을 권고한다.
