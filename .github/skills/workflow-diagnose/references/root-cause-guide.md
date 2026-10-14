# Root Cause Guide

## 증상과 원인 분리

- **Symptom:** 관찰된 결과. 예: "승인 완료까지 오래 걸린다."
- **Possible Cause:** 검증해야 할 설명. 예: "승인 담당자가 늦게 확인한다." 이는 사람을 탓하는 결론이 아니다.
- **Root Cause Candidate:** Workflow와 인과 연결이 설명되고 바꿀 수 있거나 제약으로 다룰 수 있는 원인. 예: "요청 내용이 매번 다른 형식이라 검토 전에 추가 확인이 반복된다."

원인을 Problem의 바꿔 말하기로 끝내지 않는다. `승인이 늦는 이유는 승인 지연` 같은 순환 설명은 기각하고 실제 조건을 묻는다. 한 문제에 원인이 여러 개일 수 있고, 한 원인이 여러 문제에 연결될 수도 있다. 근거에 맞게 관계를 기록한다.

## 분석 절차

1. Problem과 관련된 Work/Task/Node/Decision/Edge를 특정한다.
2. 구체적 최근 사례를 확보한다. 민감정보는 익명화한다.
3. 해당 사례에서 무엇이 일어났는지, 어떤 조건이 문제를 만들었는지 나눈다.
4. 원인 후보가 실제 사례와 인과적으로 맞는지 사용자에게 확인한다.
5. 반례를 찾는다: 원인 후보가 없는데도 같은 문제가 있었는가? 원인 후보가 있었는데 문제가 없었던 경우는 무엇이 달랐는가?
6. 필요한 검증방법과 자료, 범위, 책임자를 정한다. 확인이 안 되면 `UNVALIDATED`로 유지한다.
7. 바꿀 수 없는 정책·규제·보안·권한·접근 제한은 Root Cause와 분리해 Constraint로 기록한다.

## 5 Why 조건부 적용

표면 증상만 남거나 인과 경로가 불분명할 때만 사용한다. 다섯 번을 채우지 않는다. 매 단계에서 사용자가 실제 사례나 근거를 제공하는지 확인한다. 근거 없이 다음 원인을 자동으로 추론하지 않는다. 검증 가능하고 조치 가능한 Process 조건에 도달하면 중단한다.

예:

```text
Problem: 보고서 작성이 늦어진다.
Why 1: 자료 취합에 시간이 걸린다. [사용자 진술]
Why 2: 여러 부서 자료를 다시 맞춘다. [최근 보고서 사례]
Why 3: 부서별 양식이 서로 다르다. [자료 Artifact 확인 필요]

Root Cause Candidate: 제출 자료의 형식이 일관되지 않아 취합 시 재작업이 생길 수 있음.
Status: UNVALIDATED
Validation Plan: 최근 보고서 사례에서 자료 형식 차이와 재작업 발생을 함께 확인.
```

## Root Cause 종료 기준

원인 후보를 충분히 구체화했다고 보려면:

- Problem과 인과 연결이 설명된다.
- 증상이나 개인의 특성만 반복하지 않는다.
- 관련 Workflow 구간과 Task/Decision/Node가 지정됐다.
- Evidence가 있거나 실행 가능한 Validation Plan이 있다.
- 조직이 바꿀 수 있는지, Constraint인지 구분됐다.

원인이 확정되지 않아도 좋은 Diagnose 결과가 될 수 있다. 미검증 원인을 Stage 6이 사실로 오해하지 않도록 상태와 근거 한계를 명시한다.

## Status와 Evidence Strength

| Status | 사용 기준 |
|---|---|
| `VALIDATED` | 실제 사례/자료/데이터가 원인과 Problem의 연결을 직접 뒷받침하고 사용자 확인을 받음 |
| `PARTIALLY_VALIDATED` | 구체적 사례는 일부 지지하지만 범위·빈도·인과의 일부가 미확인 |
| `UNVALIDATED` | AI 해석, 추정, 또는 검증할 자료가 아직 없음 |

| Evidence Strength | 사용 기준 |
|---|---|
| `STRONG` | 복수의 실제 사례나 데이터가 반복 패턴과 관계를 확인 |
| `MODERATE` | 구체적 단일 사례나 Artifact가 지지하지만 범위가 제한됨 |
| `WEAK` | 경험적 진술 위주이며 검증 범위가 제한됨 |
| `UNVALIDATED` | 근거가 아직 가설 수준 |

Status와 Strength를 같은 필드로 취급하지 않는다. 예를 들어 단일 실제 사례는 원인 상태가 `PARTIALLY_VALIDATED`이고 Evidence Strength가 `MODERATE`일 수 있다. 임의 확률·점수는 만들지 않는다.

## Constraint

Constraint는 현재 조건에서 조직이 임의로 제거할 수 없는 요구·제약이다. 예: Security, Privacy, Regulation, Policy, Authority, Data Access, System Limitation, Budget, Organization, Other. 가능한 경우 출처와 담당 범위를 기록한다. Constraint 자체를 근본 원인으로 가장하거나 Stage 6에서 무시하지 않는다.
