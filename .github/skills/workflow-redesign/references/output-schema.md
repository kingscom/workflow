# Redesign Handoff Output Schema

이 파일은 Stage 7 `workflow-build`로 전달하는 JSON의 필드 규칙이다. 실제 파일은 사용자가 To-Be와 Gate 결과를 최종 검토·승인한 뒤에만 `workflow-output/redesign-result.json`에 저장한다. Stage 1~6 결과물은 읽기 전용이며 수정·삭제하지 않는다.

## JSON Template

```json
{
  "schema_version": "1.0",
  "framework_stage": "redesign",
  "source_stage": "diagnose",
  "role_context": {},
  "target_work": {},
  "selected_opportunities": [],
  "related_problems": [],
  "related_root_causes": [],
  "constraints": [],
  "baseline": [],
  "ecrs": [],
  "allocation": [],
  "to_be_workflow": {
    "nodes": [],
    "edges": [],
    "actors": [],
    "exceptions": [],
    "controls": []
  },
  "expected_impact": [],
  "decision_gate": {
    "value": "UNKNOWN",
    "feasibility": "UNKNOWN",
    "risk": "UNKNOWN",
    "decision": "REFINE",
    "decision_owner": "USER",
    "conditions": [],
    "open_risks": []
  },
  "solution_parking_lot_review": [],
  "back_loop_required": [],
  "open_questions": [],
  "next_stage": {
    "skill": "workflow-build",
    "condition": "decision_gate.decision == GO",
    "focus": [
      "SOP",
      "prototype scope",
      "acceptance criteria",
      "implementation option",
      "required context/data/tools"
    ]
  }
}
```

빈 배열은 해당 항목이 없을 때 사용한다. 빈 placeholder 객체를 만들지 않는다. JSON은 주석·trailing comma·Markdown fence 없이 저장한다. 실제 Gate 결정 전에 Template의 예시 `REFINE`을 완료 결과처럼 사용하지 않는다.

## 필드 규칙

- `role_context`, `target_work`, Stage 5의 Opportunity/Problem/Root Cause/Constraint/Baseline 의미를 원본대로 유지한다.
- 상류 Work, Task, Node, Decision, Opportunity, Problem, Root Cause ID를 보존한다. Redesign에서 새로 만든 ECRS 결과에는 `ER01` 등 새 ID, To-Be Node에는 `TN01` 등 새 ID를 부여하고 lineage를 연결한다.
- `selected_opportunities`, `related_problems`, `related_root_causes`, `constraints`, `baseline`은 Stage 5에서 선택·전달한 정보와 Evidence 상태를 포함한다. 미검증 근거를 검증된 것으로 바꾸지 않는다.
- `ecrs` 각 항목은 최소 `ecrs_id`, `task_id`, `decision`, `rationale`, 관련 Problem/Root Cause ID와 변경 근거를 보존한다. `decision`은 `ELIMINATE`, `COMBINE`, `REARRANGE`, `SIMPLIFY`, `KEEP` 중 사용한다.
- `allocation` 각 항목은 `task_id`, `to_be_task`, `allocation`, `why`, `required_data`, `required_knowledge`, `risk`, `hitl`, `control_points`, 관련 Opportunity/Root Cause, ECRS ID를 포함한다. `allocation`은 `HUMAN`, `RULE`, `SYSTEM`, `AUTOMATION`, `AI`, `AGENT`, `ELIMINATED` 중 하나다.
- `hitl`은 `{ "required": false, "pattern": "", "condition": "" }` 구조다. 필요한 경우 Pattern은 `Human Before Action`, `Human After Action`, `Exception Escalation`, `Human Decision Support` 중 하나를 명시한다.
- `to_be_workflow`는 실행 가능한 Main Flow의 `nodes`, `edges`, `actors`, `exceptions`, `controls`를 담는다. To-Be Node와 Edge는 가능한 범위에서 As-Is 및 ECRS/Allocation 항목을 참조한다.
- `expected_impact`는 지표, Map Baseline 값과 측정상태, Target 또는 Expected Direction, Target 근거, 검증상태/계획, Source ID를 연결한다. 숫자 목표를 임의로 만들지 않는다.
- `decision_gate.value`, `.feasibility`, `.risk`는 각각 `HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`; `.decision`은 `GO`, `REFINE`, `NO-GO`; `.decision_owner`는 최종 사용자일 때 `USER`다. `conditions`와 `open_risks`에 조건을 구체화한다.
- `solution_parking_lot_review`의 각 항목은 기존 Stage 5 아이디어와 검토 결과 `ACCEPTED`, `MODIFIED`, `REJECTED`, `HOLD`, 사유를 담는다. 제안은 `PROPOSED`이며 검증 전 Proven으로 표현하지 않는다.
- `back_loop_required`는 필요한 이전 Stage, 참조 ID, 이유, 다음 조치를 기록한다. 사용자의 동의 없이 이전 결과를 수정하지 않는다.
- `open_questions`에는 결정을 좌우하는 미확인 사항과 담당/확인계획을 남긴다.
- `next_stage`는 Stage 7 Build의 초점이며, `decision_gate.decision == GO`일 때만 Build로 연결한다.

## Handoff와 최종 제공물

JSON 이외의 사용자 검토 산출물도 함께 제공한다.

1. Redesign Summary: Target Work, Opportunity, Root Cause, ECRS, 주요 Allocation, Why AI/Why Not AI, HITL/Control, Expected Impact, Gate
2. ECRS Canvas: Task ID, Current Task, 관련 Problem/Root Cause, E/C/R/S, 최종 결정, 근거
3. Allocation Table: Task ID, To-Be Task, Allocation, Why, Data/Knowledge, Risk, HITL, Control Point
4. To-Be Workflow: Summary, Node Table, 렌더 가능한 Mermaid, As-Is → To-Be Change Map
5. Decision Gate: Value/Feasibility/Risk 근거, 사용자 결정, 조건, Open Risks, Required Validation
6. Stage 7 Handoff JSON

As-Is → To-Be Change Map의 Change Type은 `ELIMINATED`, `COMBINED`, `REARRANGED`, `SIMPLIFIED`, `ROLE_CHANGED`, `UNCHANGED`, `NEW` 중 하나다.
