# Diagnose Handoff Output Schema

Diagnose 결과는 사용자의 최종 검토·확인 후 `workflow-output/diagnose-result.json`에 저장한다. Stage 4 입력은 읽기 전용이다. 이 JSON은 Stage 6 `workflow-redesign`의 문제·원인·기회와 남은 검증 대상을 전달한다.

## JSON Template

```json
{
  "schema_version": "1.0",
  "framework_stage": "diagnose",
  "source_stage": "map",
  "role_context": {},
  "target_work": {},
  "workflow_reference": {
    "source_file": "workflow-output/map-result.json",
    "related_work_ids": [],
    "related_task_ids": [],
    "related_node_ids": [],
    "related_decision_ids": [],
    "walkthrough_status": "UNKNOWN"
  },
  "baseline": [],
  "problems": [
    {
      "problem_id": "P01",
      "related_nodes": [],
      "related_tasks": [],
      "observation": "",
      "observation_evidence": [],
      "pain_points": [],
      "problem_statement": "",
      "root_causes": [
        {
          "root_cause_id": "RC01",
          "description": "",
          "status": "UNVALIDATED",
          "evidence_strength": "UNVALIDATED",
          "evidence": [],
          "validation_plan": ""
        }
      ],
      "constraints": []
    }
  ],
  "opportunities": [
    {
      "opportunity_id": "OP01",
      "related_problem": "P01",
      "related_root_causes": [],
      "description": "",
      "expected_improvement": [],
      "related_baseline": [],
      "impact": "UNKNOWN",
      "frequency_or_reach": "UNKNOWN",
      "evidence_strength": "UNVALIDATED",
      "addressability": "UNKNOWN",
      "priority": "HOLD",
      "validation_status": "UNVALIDATED"
    }
  ],
  "validation_backlog": [
    {
      "hypothesis_id": "HYP01",
      "what_to_validate": "",
      "why_important": "",
      "validation_method": "CASE_VALIDATION",
      "required_evidence": [],
      "owner": "Unknown",
      "status": "NOT_STARTED",
      "related_problem": "P01",
      "related_root_cause": "RC01",
      "source_refs": []
    }
  ],
  "solution_parking_lot": [
    {
      "idea": "",
      "related_problem": "Unknown",
      "proposed_by": "Unknown",
      "status": "NOT_EVALUATED"
    }
  ],
  "no_significant_opportunity": false,
  "back_loop_required": [],
  "open_questions": [],
  "next_stage": {
    "skill": "workflow-redesign",
    "focus": [
      "eliminate",
      "combine",
      "rearrange",
      "simplify",
      "human-rule-system-automation-ai-agent allocation",
      "value-feasibility-risk gate"
    ]
  }
}
```

The template shows optional illustrative entries. Emit empty arrays when no matching item exists; do not emit blank placeholder records. The JSON file must contain valid JSON only, with no comments, trailing commas, or Markdown fences.

## Field Rules

- Copy `role_context` and `target_work` from Map without modifying their meaning. Retain upstream Work, Task, Decision, Node, and Evidence references.
- `workflow_reference` identifies the source Map and the IDs used in analysis. `walkthrough_status` is `CONFIRMED`, `PARTIAL`, or `UNKNOWN`.
- `baseline` carries relevant source metrics with their source metric/name, current value, exact `MEASURED`/`ESTIMATED`/`UNKNOWN` status, evidence, measurement plan, and source refs. Never convert an estimate or unknown to a measured value.
- `observation` describes a reported or measured phenomenon. `observation_evidence` records provenance and evidence status. Keep interpretation explicitly labeled `HYPOTHESIS` in evidence entries or open questions.
- `pain_points` records user/stakeholder experience without generalizing one person's statement to all users.
- `problem_statement` is solution-neutral and connects situation, observed phenomenon, and work impact.
- `root_causes[].status` is `VALIDATED`, `PARTIALLY_VALIDATED`, or `UNVALIDATED`. `evidence_strength` is `STRONG`, `MODERATE`, `WEAK`, or `UNVALIDATED`. `evidence` is an array of objects with description, source/type, and source refs as available. An unvalidated cause must include a useful `validation_plan` or linked backlog item.
- `constraints` is separate from causes. Each item records `constraint_type`, `description`, `evidence`, and source refs when available.
- `opportunities` link to Problem/Root Cause IDs. `description` and `expected_improvement` must not prescribe AI, Agent, RPA, automation, system implementation, or a redesigned process.
- `impact`, `frequency_or_reach`, and `addressability` are each `HIGH`, `MEDIUM`, `LOW`, or `UNKNOWN`. `evidence_strength` uses the four values above. `priority` is `HIGH`, `MEDIUM`, `LOW`, or `HOLD`.
- `related_baseline` refers to relevant Map Metric IDs/names and preserves the exact measurement status. When unknown, add a measurement plan rather than invented values.
- `validation_backlog[].validation_method` uses `CASE_VALIDATION`, `ARTIFACT_VALIDATION`, `STAKEHOLDER_VALIDATION`, `DATA_VALIDATION`, `COUNTEREXAMPLE`, or `UNKNOWN`. `owner` may be `Unknown`; status is `NOT_STARTED`, `IN_PROGRESS`, `VALIDATED`, `REJECTED`, or `BLOCKED`.
- `solution_parking_lot` is optional. Preserve proposed ideas separately with `NOT_EVALUATED`; do not promote them to Opportunity or claim feasibility.
- `no_significant_opportunity` is `true` when analysis does not establish a meaningful opportunity. This does not assert that no problem could exist outside the evidence/scope.
- `back_loop_required` items contain `stage`, `related_refs`, and `reason`. Valid stages are `workflow-map`, `workflow-decompose`, `workflow-deep-dive`, `workflow-discover`.
- `open_questions` preserve consequential unknowns. Do not conceal unresolved cause or evidence gaps.
- `next_stage` is `workflow-redesign`. Diagnose does not perform its focus items; it passes validated problem definitions and opportunities forward.

## Evidence Entry

An evidence object should preserve source and confidence without inventing precision. Example:

```json
{
  "description": "최근 보고서 2건에서 부서별 자료 형식이 달랐음",
  "evidence_type": "STATED",
  "evidence_strength": "MODERATE",
  "source": "사용자가 확인한 최근 사례",
  "source_refs": ["T04.2", "N08"]
}
```

Evidence Type can be `VERIFIED`, `STATED`, or `HYPOTHESIS`. Do not confuse it with Baseline Measurement Status or Evidence Strength.
