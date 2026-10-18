# Acceptance Criteria Guide

Acceptance Criteria는 Prototype 구현 전에 작성한다. "잘 동작한다", "정확하다"처럼 판정 불가능한 문구 대신 입력 조건, 관찰 결과, 측정 방법 및 Pass Condition을 명시한다.

## 기준 필드

각 기준에 다음을 기록한다.

| Field | 설명 |
|---|---|
| `ac_id` | 고유 ID (예: `AC01`) |
| `related_to_be_node` | Stage 6 To-Be Node |
| `criterion` | 검증할 행동·품질 |
| `test_method` | 실행 또는 Review 방법 |
| `pass_condition` | 명확한 통과 경계 |
| `evidence_required` | 보존할 결과·로그·검토기록 |
| `priority` | `MUST`, `SHOULD`, `NICE_TO_HAVE` |
| `result` | `PASS`, `FAIL`, `BLOCKED`, `NOT_TESTED` |
| `evidence` | 실제 Test Evidence 위치/요약 |

결과를 판정하기 전에는 `NOT_TESTED`로 둔다. 성공 결과를 미리 채우지 않는다.

## 기준 유형

업무와 위험에 필요한 유형만 선택한다.

- **Functional:** 필요한 기능이 수행되는가
- **Quality:** 결과가 정의한 품질 조건을 충족하는가
- **Accuracy:** 정답 또는 기준 결과와 일치하는가
- **Completeness:** 필수 정보가 빠짐없이 포함되는가
- **Consistency:** 동일 조건에서 결과가 허용 범위 안에서 일관적인가
- **Safety:** 금지된 행동·출력이 발생하지 않는가
- **Human Control:** 필수 검토·승인·거부 흐름이 작동하는가
- **Exception Handling:** 누락·오류·접근 실패 등이 적절히 처리되는가
- **Performance:** 정의한 처리시간 등 성능 조건을 만족하는가

## 작성 및 판정 규칙

- 각 Acceptance Criteria는 하나의 독립적으로 검증 가능한 결과를 측정한다.
- 가능하면 정량 임계값을 사용하되, 임계값은 사용자 요구·기준 데이터·정책 등 출처가 있어야 한다. 임의 수치를 만들지 않는다.
- `MUST`는 Pilot 진입에 필요한 핵심 조건으로 사용한다. `SHOULD`와 `NICE_TO_HAVE` 미달을 MUST 통과처럼 표시하지 않는다.
- Evidence가 없거나 Test를 실행할 수 없으면 `NOT_TESTED` 또는 `BLOCKED`로 기록한다.
- UI 외관이나 기술적 동작만으로 업무 적합성이 증명됐다고 보지 않는다.
- Test 결과가 Prototype의 AC 충족 여부를 말할 뿐, Baseline 대비 실제 업무효과를 입증하지 않는다는 점을 구분한다.
