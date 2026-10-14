# Map Handoff Output Schema

Map Handoff는 `workflow-output/map-result.json`에 저장한다. Stage 1~3 결과는 읽기 전용이며 `role_context`, `target_work`, `task_tree`, `knowledge_decision_map`을 가능한 한 그대로 계승한다.

## JSON Template

```json
{
  "schema_version": "1.0",
  "framework_stage": "map",
  "source_stage": "deep-dive",
  "role_context": {},
  "target_work": {},
  "task_tree": [],
  "knowledge_decision_map": [],
  "workflow": {
    "trigger": {
      "node_id": "N00",
      "description": "",
      "source_refs": [],
      "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"}
    },
    "nodes": [
      {
        "node_id": "N00",
        "node_type": "TRIGGER",
        "actor": "Unknown",
        "activity": "업무 시작 사건",
        "input": "Unknown",
        "output": "Unknown",
        "system_tool": "Unknown",
        "knowledge_data": [],
        "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"},
        "source_refs": []
      },
      {
        "node_id": "N01",
        "node_type": "TASK",
        "actor": "Unknown",
        "activity": "",
        "input": "Unknown",
        "output": "Unknown",
        "system_tool": "Unknown",
        "knowledge_data": [],
        "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"},
        "source_refs": []
      },
      {
        "node_id": "O01",
        "node_type": "OUTPUT",
        "actor": "Unknown",
        "activity": "업무 산출물",
        "input": "Unknown",
        "output": "",
        "system_tool": "Unknown",
        "knowledge_data": [],
        "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"},
        "source_refs": []
      },
      {
        "node_id": "Z99",
        "node_type": "END",
        "actor": "Unknown",
        "activity": "업무 종료",
        "input": "Unknown",
        "output": "Unknown",
        "system_tool": "Unknown",
        "knowledge_data": [],
        "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"},
        "source_refs": []
      }
    ],
    "edges": [
      {"from": "N00", "to": "N01", "label": "", "condition": "Unknown", "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"}, "source_refs": []},
      {"from": "N01", "to": "O01", "label": "", "condition": "Unknown", "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"}, "source_refs": []},
      {"from": "O01", "to": "Z99", "label": "", "condition": "Unknown", "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"}, "source_refs": []}
    ],
    "actors": [],
    "handoffs": [],
    "waits": [],
    "loops": [],
    "exceptions": [],
    "escalations": [],
    "output": {"node_id": "O01", "description": "", "source_refs": [], "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"}},
    "end": {"node_id": "Z99", "description": "", "source_refs": [], "evidence": {"type": "HYPOTHESIS", "source": "", "confidence": "Unknown"}}
  },
  "baseline": [
    {"metric": "", "current_value": "Unknown", "measurement_status": "UNKNOWN", "evidence": "", "measurement_plan": ""}
  ],
  "evidence_status": {
    "inherited": {"discover": {}, "decompose": {}, "deep_dive": {}},
    "map_additions": {"verified": [], "stated": [], "hypothesis": []}
  },
  "back_loop_required": [],
  "open_questions": [],
  "next_stage": {
    "skill": "workflow-diagnose",
    "focus": ["pain points", "bottlenecks", "root causes", "validated opportunities"]
  }
}
```

Evidence Type values are `VERIFIED`, `STATED`, or `HYPOTHESIS`; Confidence values are `High`, `Medium`, `Low`, or `Unknown`.

## Collection Item Fields

Arrays may be empty when no matching element was confirmed. When populated, use these fields and retain evidence and lineage where applicable:

- `actors`: `actor_id`, `name`, `role`, `actor_type`, `evidence`, `source_refs`
- `handoffs`: `handoff_id`, `from_node_id`, `to_node_id`, `from_actor`, `to_actor`, `information`, `wait_node_id`, `evidence`, `source_refs`
- `waits`: `node_id`, `waiting_for`, `start_condition`, `end_condition`, `average_duration`, `measurement_status`, `evidence`, `source_refs`
- `loops`: `loop_id`, `from_node_id`, `to_node_id`, `trigger`, `repeat_count`, `exit_condition`, `evidence`, `source_refs`
- `exceptions`: `exception_id`, `trigger`, `node_path`, `rejoin_node_id`, `evidence`, `source_refs`
- `escalations`: `from_node_id`, `condition`, `target_actor`, `information`, `return_node_id`, `evidence`, `source_refs`
- `back_loop_required`: `stage`, `related_refs`, `reason`

Use `Unknown` for unconfirmed scalar values and `[]` for an empty collection. A `rejoin_node_id`, `wait_node_id`, or `return_node_id` is a node ID only when that connection is known; otherwise use `Unknown`.

## Field Rules

- `role_context`, `target_work`, `task_tree`, and `knowledge_decision_map` preserve upstream values and IDs. Do not rebuild or silently edit them.
- `workflow.trigger`, `workflow.output`, and `workflow.end` align with the target work boundaries.
- `workflow.nodes` includes every flow node, including the trigger, output, and end nodes; the corresponding summary objects refer to those same node IDs.
- `nodes` use `node_type`: `TRIGGER`, `TASK`, `DECISION`, `HANDOFF`, `WAIT`, `LOOP`, `EXCEPTION`, `ESCALATION`, `OUTPUT`, or `END`.
- `edges` connect only known nodes. `condition` and branch `label` use user-confirmed conditions; unknown transitions are questions, not invented edges.
- `actors` contain only named/confirmed roles or systems. Unknown actor is the string `Unknown` on the node; do not infer ownership from typical practice.
- `handoffs`, `waits`, `loops`, `exceptions`, and `escalations` contain only verified/stated flow elements. Use `Unknown` for unknown details and `[]` when no element was confirmed.
- Each `source_refs` item records known lineage such as `work_id`, `task_id`, `decision_id`, `knowledge_id`, or `exception_id`. Do not create upstream IDs.
- Evidence objects use `VERIFIED`, `STATED`, or `HYPOTHESIS`. Preserve upstream status; new Map connections remain `HYPOTHESIS` until user-confirmed.
- `baseline[].measurement_status` is exactly `MEASURED`, `ESTIMATED`, or `UNKNOWN`. Keep its Evidence and Measurement Plan distinct from Evidence Type.
- `back_loop_required` contains a stage name, related IDs, and reason. It is empty when no Back Loop is required.
- `open_questions` contain unresolved sequence, actor, branch, time, measurement, or boundary questions.
- `evidence_status.inherited` preserves the available source status objects from Stage 1~3 without changing their meaning; `map_additions` tracks newly confirmed Map evidence by type.
- `next_stage` is `workflow-diagnose`, as defined by the framework handoff, even when that Skill is not yet present in the repository.
- Emit valid JSON only in the file: no comments, trailing commas, Markdown fences, or prose outside the object.