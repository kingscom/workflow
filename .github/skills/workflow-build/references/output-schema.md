# Build Handoff Output Schema

Stage 8 `workflow-embed`가 사용할 Build Handoff 규칙이다. 유효한 JSON은 사용자가 최종 검토·저장을 승인한 뒤 `workflow-output/build-result.json`에 저장한다. 기존 Stage 결과를 수정하거나 삭제하지 않는다.

## JSON Template

```json
{
  "schema_version": "1.0",
  "framework_stage": "build",
  "source_stage": "redesign",
  "role_context": {},
  "target_work": {},
  "selected_opportunities": [],
  "baseline": [],
  "to_be_workflow": {},
  "build_hypothesis": "",
  "prototype_scope": {
    "in_scope": [],
    "mock": [],
    "out_of_scope": []
  },
  "implementation": {
    "type": [],
    "components": [],
    "data": [],
    "context": [],
    "tools": [],
    "integrations": [],
    "constraints": []
  },
  "sop": [],
  "acceptance_criteria": [],
  "test_results": [],
  "issues": [],
  "build_decision": {
    "status": "BLOCKED",
    "reason": "",
    "conditions": []
  },
  "pilot_requirements": {
    "target_users": "",
    "sample_size": "",
    "duration": "",
    "metrics": [],
    "controls": [],
    "rollback": ""
  },
  "back_loop_required": [],
  "open_questions": [],
  "next_stage": {
    "skill": "workflow-embed",
    "condition": "build_decision.status == READY_FOR_PILOT",
    "focus": [
      "pilot",
      "before-after measurement",
      "real workflow performance",
      "exceptions",
      "user feedback",
      "organizational constraints",
      "iterate",
      "adoption"
    ]
  }
}
```

`acceptance_criteria` 항목은 다음 구조를 따른다.

```json
{
  "ac_id": "AC01",
  "related_to_be_node": "TN01",
  "criterion": "",
  "priority": "MUST",
  "test_method": "",
  "pass_condition": "",
  "result": "NOT_TESTED",
  "evidence": ""
}
```

`test_results` 항목은 `test_id`, `scenario`, `related_ac`, `expected`, `actual`, `result`, `evidence`, `issue`를 포함한다. `result`는 `PASS`, `FAIL`, `BLOCKED`, `NOT_TESTED` 중 하나다.

## 필드 및 lineage 규칙

- `role_context`, `target_work`, `selected_opportunities`, `baseline`, `to_be_workflow`는 승인된 Redesign Handoff에서 필요한 정보를 이어받는다. 상류 ID와 의미를 보존한다.
- Opportunity → Problem/Root Cause → To-Be Node → SOP Step → Acceptance Criteria → Test의 추적성을 유지한다. 빈 placeholder 객체를 산출물에 남기지 않는다.
- `prototype_scope`는 `in_scope`, `mock`, `out_of_scope`를 분리한다. 각 항목은 대상, 관련 To-Be Node, 이유 및 검증 목적을 포함한다.
- `implementation.type`은 실제 사용한 Allocation 방식만 기록한다. 나머지 구현 요소는 확인된 Component, Data, Context, Tool, Integration, Constraint만 기입한다.
- SOP Step은 [SOP Guide](sop-guide.md)의 필드를 사용하고 관련 To-Be Node를 참조한다.
- Acceptance Criteria의 `priority`는 `MUST`, `SHOULD`, `NICE_TO_HAVE`; Test 결과는 `PASS`, `FAIL`, `BLOCKED`, `NOT_TESTED`다.
- `build_decision.status`는 `READY_FOR_PILOT`, `ITERATE`, `REDESIGN_REQUIRED`, `BLOCKED`, `STOP` 중 하나다. 이유와 조건을 함께 기록한다.
- Gate가 GO가 아니면 Build를 수행하거나 성공 모양의 Handoff를 만들지 않는다. `REFINE`은 `BUILD_BLOCKED: REDESIGN_REFINEMENT_REQUIRED`, `NO-GO`는 `BUILD_NOT_REQUIRED: NO-GO`로 명시한다.
- `READY_FOR_PILOT`일 때 Pilot Requirements를 준비한다. Pilot에서 검증할 Baseline·Metric·통제·Rollback을 기록하며 업무 개선효과를 미리 확정하지 않는다.
- `back_loop_required`는 이전 Stage, 참조 ID, 이유 및 다음 조치를 기록한다. 사용자 승인 없이 상류 결과를 변경하지 않는다.
- `next_stage`는 `workflow-embed`이며 `build_decision.status == READY_FOR_PILOT`일 때만 진행한다.

JSON은 주석·trailing comma·Markdown fence 없이 저장한다. Test를 실행하지 않았으면 `PASS`로 표시하지 않는다.
