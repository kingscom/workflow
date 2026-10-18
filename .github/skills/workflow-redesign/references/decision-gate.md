# Value × Feasibility × Risk Decision Gate

## 평가 원칙

To-Be 초안이 만들어진 뒤 Build로 진행할지 판단한다. Value, Feasibility, Risk는 각각 `HIGH`, `MEDIUM`, `LOW`, `UNKNOWN` 중 하나로 기록하고 Evidence/Rationale을 붙인다. 정교한 수치 점수, 가중합, 근거 없는 개선율을 만들지 않는다.

### Value

- Problem Impact
- Frequency / Reach
- Expected Improvement
- Business Importance
- User Benefit

### Feasibility

- Data Availability
- Knowledge Availability
- Technical Feasibility
- System/API Access
- Process Stability
- Required Capability
- Cost/Effort

실제 접근·권한·기능이 확인되지 않으면 가능하다고 가정하지 않는다. 아직 확인하지 않은 항목은 `UNKNOWN`이다.

### Risk

- Error Impact
- Security / Privacy / Regulation / Policy
- Accountability
- Irreversibility
- Operational Risk

높은 Risk가 자동으로 NO-GO를 뜻하지 않는다. 적절한 Control Point와 HITL로 관리 가능한지 평가한다. 그 통제가 아직 확인되지 않았으면 조건 또는 Open Risk로 명시한다.

## Expected Impact

Stage 4 Baseline과 Stage 5 Opportunity에 연결해 개선지표를 정의한다. 가능한 지표는 Lead Time, Touch Time, Wait Time, Rework, Error, Human Touch, Quality 등이다.

- Baseline 값과 `MEASURED` / `ESTIMATED` / `UNKNOWN` 상태를 그대로 유지한다.
- 수치 Target은 사용자가 제공했거나 근거가 있을 때만 기록한다.
- 근거가 없으면 정확한 Target 대신 `Expected Direction`과 검증방법을 제시한다.
- Target을 정했다면 출처를 기록하고 미검증 목표는 `TO_VALIDATE`로 표시한다.

## Gate 결과와 사용자 결정

### `GO`

가치가 충분하고 실현 가능하며 주요 Risk를 통제할 근거가 있다. 사용자 승인 후 Stage 7 `workflow-build`로 전달한다.

### `REFINE`

Opportunity는 유효하지만 To-Be, Evidence, 데이터 접근, 권한, 비용, HITL 또는 Risk 통제가 부족하다. 부족한 항목과 필요한 검증/재설계를 적고 Build로 넘기지 않는다.

필요한 경우 다음을 표시한다.

- `BACK_LOOP_REQUIRED: workflow-diagnose`
- `BACK_LOOP_REQUIRED: workflow-map`
- `BACK_LOOP_REQUIRED: workflow-deep-dive`
- `BACK_LOOP_REQUIRED: workflow-decompose`
- `BACK_LOOP_REQUIRED: workflow-discover`
- `REDESIGN_REFINEMENT_REQUIRED`

### `NO-GO`

현재 조건에서 Build 가치가 없거나 실현 불가능하거나 Risk가 과도하다. 정상적인 결과로 인정한다. No-Go Reason, Learned Insight, Alternative Process Improvement, Revisit Condition을 기록하고 Build로 넘기지 않는다.

어떤 Gate도 AI가 사용자 대신 확정하지 않는다. 근거와 권고를 제시한 뒤 사용자에게 `GO / REFINE / NO-GO` 중 최종 결정을 요청한다. 사용자가 결정을 보류하면 `UNKNOWN` 또는 미결정으로 남기고 성공한 Gate처럼 저장하지 않는다.

## No Significant Opportunity

Stage 5에 `no_significant_opportunity: true`이면 강제로 To-Be나 AI 과제를 만들지 않는다. 사용자가 현재 Workflow를 유지할지, 다른 Target Work를 고를지, Evidence를 추가 수집할지 확인한다. 필요에 따라 `NO-GO` 또는 `BACK_LOOP_REQUIRED: workflow-discover`로 기록한다.
