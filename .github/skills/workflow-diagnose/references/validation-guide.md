# Validation Guide

## 검증 설계 원칙

검증은 원인 가설을 확인하거나 반증할 수 있어야 한다. `자료를 더 살펴본다` 대신 대상·범위·관찰 항목·판정 기준을 구체화한다. 필요한 정보만 요청하고 개인정보·인증정보는 요청하지 않는다. 불가능한 검증은 억지로 완료 처리하지 말고 Backlog에 계획으로 남긴다.

## Validation Method

| 방법 | 적합한 경우 | 확인할 사항 |
|---|---|---|
| `CASE_VALIDATION` | 최근 여러 사례의 반복 패턴을 비교 | 기간/건수, 포함·제외 기준, 예외 사례 |
| `ARTIFACT_VALIDATION` | 문서·메일·요청서·보고서 등 산출물에 현상이 남음 | 어떤 필드/버전/수정 이력을 볼지 |
| `STAKEHOLDER_VALIDATION` | 관련 역할의 사실 확인이 필요함 | 누구의 어떤 사실 확인이 필요한지 |
| `DATA_VALIDATION` | 시간·건수·오류·재작업을 정량 확인 가능 | 데이터 정의, 기간, 분모, 출처 |
| `COUNTEREXAMPLE` | 인과 주장을 반증하거나 조건을 한정해야 함 | 가설이 있어도 문제가 없었던 사례, 가설이 없어도 문제가 난 사례 |

방법은 여러 개를 사용할 수 있다. 실제로 수행하지 않은 검증은 완료로 표시하지 않는다.

## Validation Backlog

중요한 미검증 가설마다 다음을 남긴다.

- `hypothesis_id`
- `what_to_validate`
- `why_important`
- `validation_method`
- `required_evidence`
- `owner` (`Unknown` 허용)
- `status` (`NOT_STARTED`, `IN_PROGRESS`, `VALIDATED`, `REJECTED`, `BLOCKED`)
- 연결할 수 있으면 `related_problem`, `related_root_cause`, `source_refs`

측정이나 검증이 당장 불가능해도 Validation Plan은 유효한 결과다. 기한이나 샘플 수가 확인되지 않았다면 만들어내지 말고 `Unknown` 또는 질문으로 남긴다.

## 사용자 검증과 반례

가설을 사실처럼 유도하지 않는 중립 질문을 사용한다. 예: "요청 양식이 달랐던 사례와 동일한 양식인데도 재작업이 발생한 사례가 각각 있나요?" 사용자가 동의했다는 사실만으로 충분한 Data Validation을 주장하지 않는다. 사용자 확인과 독립 자료 확인을 구분한다.

사용자의 "아마 절반" 같은 응답은 VERIFIED 수치가 아니다. 출처가 경험적 보고면 그 성격을 보존하고, 수치가 중요하면 데이터 정의와 확인 계획을 만든다.

## Prioritization

각 Opportunity를 별도로 판단한다.

- `impact`: 개선 시 업무성과에 미칠 영향 (`HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`)
- `frequency_or_reach`: 발생 빈도 또는 영향 범위 (`HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`)
- `evidence_strength`: Root Cause Guide의 네 단계
- `addressability`: 조직이 원인에 영향을 줄 수 있는 정도 (`HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`)
- `priority`: `HIGH`, `MEDIUM`, `LOW`, `HOLD`

정량 점수, 가중합, 임의 순위는 만들지 않는다. 중요한 원인이 미검증이거나 측정이 불가능하면 `HOLD`로 두고 다음 확인을 설명한다. 이 평가에 AI Suitability, Agent 가능성, 자동화 가능성, 기술 비용을 넣지 않는다.

## Baseline 연결

Opportunity에는 관련 Baseline 항목을 식별 가능하게 연결한다. Map 값의 Metric, Current Value, Measurement Status, Evidence, Measurement Plan을 보존한다. `UNKNOWN`은 숫자로 바꾸지 않는다. 개선 전후 비교가 필요하지만 Baseline이 없다면 `workflow-map` Back Loop 또는 후속 Measurement Plan을 명시한다.

## No Significant Opportunity

다음 조건이면 `no_significant_opportunity: true`를 사용할 수 있다.

- 확인 가능한 범위에서 의미 있는 Problem/Root Cause가 확인되지 않음
- 신호가 있었으나 영향이 작거나 근거가 부족해 개선 가치가 입증되지 않음
- 분석 범위 안에서 후보를 억지로 만들지 않는 편이 타당함

미검증 가설이나 열린 질문은 함께 남길 수 있다. `no_significant_opportunity: true`는 "아무 문제도 절대 없다"는 사실 주장이 아니다.
