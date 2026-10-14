# Evidence and Confidence Guide

Deep Dive Map의 각 중요 Decision, Cue, Rule, Knowledge, Reasoning, Exception, Escalation에 Evidence Type을 표시한다. 근거 수준이 달라지는 항목은 한 덩어리로 표시하지 않고 분리한다.

## Evidence Type

| Type | 사용 조건 | 기록 예 |
|---|---|---|
| `VERIFIED` | 구체적인 실제 사건이나 사용자가 제공한 실제 자료·문서·로그로 내용이 확인됨 | 최근 실제 판단 사례에서 사용자가 확인한 Cue |
| `STATED` | 사용자가 자신의 일반적인 업무방식이라고 직접 설명했으나 구체 사례나 별도 자료로 확인되지 않음 | “보통은 이 순서로 확인한다”는 사용자 진술 |
| `HYPOTHESIS` | AI의 해석 또는 아직 사용자 확인을 받지 않은 가능성 | 예상되는 판단 기준과 이를 확인할 질문 |

HYPOTHESIS는 사용자 확인 전 Knowledge/Decision Map의 확정 사실로 취급하지 않는다. 사용자가 동의하면 근거에 맞게 `STATED`, 실제 사례/자료로 확인되면 `VERIFIED`로 변경한다. 가설이 부정되면 제거한다.

## 근거 출처

`source`에는 구체적인 실제 사례, 제공 자료, 문서, 시스템 데이터, 사용자 일반 진술 등 실제 근거를 간단히 기록한다. 사용자나 자료가 제공하지 않은 출처를 만들어내지 않는다. 민감정보는 익명화하거나 범주로 바꾼다.

## Confidence

Confidence는 Evidence Type과 별도다. 사용자가 설명한 정도와 내부 일관성, 구체 사례와의 연결을 나타내는 보조 표기이지 사실 확률이나 AI의 확신 점수가 아니다.

- `High`: 구체 사례와 설명이 명료하고 서로 일치함
- `Medium`: 일부 내용은 분명하나 범위나 재현성이 제한적임
- `Low`: 회상이 불확실하거나 설명이 모호함

충분한 근거가 없으면 `Low` 또는 `Unknown`이다. `HYPOTHESIS`를 높은 Confidence로 제시하지 않는다.

## 기록 규칙

- 사용자 표현과 AI 요약을 구분한다. 의미가 달라질 정도로 매끄럽게 고치지 않는다.
- 규칙과 경험적 Heuristic을 구분한다. 사용자가 명시적 규칙이라고 말하지 않았다면 규칙으로 단정하지 않는다.
- 부정·반례·불확실성도 보존한다.
- 근거가 없는 필드는 `Unknown` 또는 적용되지 않음이 확인된 경우 `N/A`다.
- 확정되지 않은 예상은 `unresolved_hypotheses`에 확인 질문과 함께 둔다.