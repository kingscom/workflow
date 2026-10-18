# Prototype Scope Guide

Stage 7의 목적은 완성품 개발이 아니라 Stage 6 To-Be의 핵심 가설을 최소 비용·범위로 검증하는 것이다. 가장 불확실한 가설, 높은 위험, 적은 구현비용으로 확인 가능한 요소를 우선한다.

## GO Gate

`workflow-output/redesign-result.json`의 `decision_gate.decision`을 먼저 확인한다.

| Gate | 처리 |
|---|---|
| `GO` | 조건과 Open Risk를 확인한 뒤 범위 정의 진행 |
| `REFINE` | `BUILD_BLOCKED: REDESIGN_REFINEMENT_REQUIRED`; Build/구현 금지 |
| `NO-GO` | `BUILD_NOT_REQUIRED: NO-GO`; Build/구현 불필요 |
| 누락·미지원 값·입력 오류 | GO로 간주하지 않고 중단 및 확인 요청 |

Gate가 GO여도 조건이 충족되지 않았으면 그 조건을 감추거나 임의로 해결된 것으로 취급하지 않는다.

## Build Hypothesis

가설은 검증 대상과 관찰 가능한 결과를 포함한다. 가급적 다음 문장을 사용한다.

> `[Prototype/변경]이 [대상과 조건]에서 [관찰 가능한 업무 결과]를 만들 수 있다.`

가설은 기대치이지 사실이나 보장된 Business Impact가 아니다. 선택한 Opportunity, 관련 Problem/Root Cause, To-Be Node, Baseline 및 Evidence 상태와 연결한다. 측정되지 않은 성과 목표를 임의로 만들지 않는다.

## Prototype Scope

각 To-Be 요소를 다음으로 분류한다.

- **IN SCOPE:** 가설 및 MUST Acceptance Criteria 검증에 필요한 실제 Prototype 요소
- **MOCK:** 실제 Data, API, Connector, Model 또는 System을 사용할 수 없을 때 대체하는 모의 요소. 입력·출력·제한을 명시한다.
- **OUT OF SCOPE:** 가설 검증에 필요하지 않은 운영 준비·기능·통합. 이유와 필요 시 후속 단계를 기록한다.

Scope 표에는 Item, Related To-Be Node, Scope, Reason, Validation Purpose를 포함한다. 운영 시스템 통합이 가설 검증에 반드시 필요하지만 Mock으로 검증할 수 없다면 구현 가능성을 꾸며내지 말고 `BLOCKED` 또는 Stage 6 Back Loop를 고려한다.

## Environment and Readiness

착수 전에 개발 환경, 사용 가능한 파일·Model, Data 및 Context 출처·접근·민감도, Tool/API/Connector, Permission, Network/Security 제한, Test Environment를 확인한다. 확인되지 않은 항목은 `UNKNOWN`으로 둔다.

필요한 정보가 불충분하면 사용자에게 최소한의 비민감 정보만 요청한다. 비밀번호, API Key, 실제 개인정보를 채팅·문서·소스·로그에 기록하지 않는다.

## 범위 통제

Acceptance Criteria를 만족하는 데 필요한 작업만 Prototype에 포함한다. 요구가 늘어나면 다음으로 분류한다.

- `REQUIRED_FOR_AC`
- `PILOT_BACKLOG`
- `FUTURE`
- `REDESIGN_REQUIRED`

로그인, Dashboard, 관리 기능 등은 MUST 기준 검증에 필요한 근거가 없으면 제외한다. Build 중 Problem/Opportunity를 재정의하거나 Stage 6 Allocation을 조용히 바꾸지 않는다.
