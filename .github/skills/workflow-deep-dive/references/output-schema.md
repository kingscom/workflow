# Deep Dive Output Schema

Stage 2 `decompose-result.json`을 읽기 전용으로 사용한다. 사용자가 Tacit Knowledge & Decision Map을 검토한 뒤에만 Handoff를 확정한다. 저장 경로는 `workflow-output/deep-dive-result.json`이다.

## JSON 템플릿

```json
{
  "schema_version": "1.0",
  "framework_stage": "deep-dive",
  "source_stage": "decompose",
  "role_context": {},
  "target_work": {},
  "task_tree": [],
  "knowledge_decision_map": [
    {
      "task_id": "",
      "decision": "Unknown",
      "cues": [],
      "rule_or_heuristic": "Unknown",
      "required_knowledge": [],
      "data_sources": [],
      "reasoning": "Unknown",
      "exceptions": [],
      "escalation": {
        "condition": "Unknown",
        "target": "Unknown"
      },
      "evidence": {
        "type": "STATED",
        "source": "Unknown",
        "confidence": "Unknown"
      }
    }
  ],
  "unresolved_hypotheses": [],
  "back_loop_required": [],
  "open_questions": [],
  "next_stage": {
    "skill": "workflow-map",
    "focus": [
      "end-to-end sequence",
      "decision branches",
      "handoffs",
      "loops",
      "baseline"
    ]
  }
}
```

## 필드 규칙

- `role_context`, `target_work`, `task_tree`는 Stage 2 Handoff에서 그대로 가져온다. 이 Skill에서 Task를 재분해하거나 원본 파일을 수정하지 않는다.
- `knowledge_decision_map`에는 Deep Dive가 실제로 진행된 Task만 넣는다. 단순 Task를 억지로 포함하지 않는다.
- 각 항목의 `task_id`는 입력 Task ID와 일치해야 한다.
- `decision`, `cues`, `rule_or_heuristic`, `required_knowledge`, `data_sources`, `reasoning`, `exceptions`, `escalation`은 사용자 진술에 근거해 작성한다. 미확인은 문자열 `Unknown`, 확인된 비적용은 `N/A`, 목록형 미확인은 빈 배열을 쓴다.
- `exceptions`는 확인된 예외에 한해 간단한 설명과 필요한 경우 Trigger를 포함한다. 상세 내용은 실제로 질문해 얻은 정보만 쓴다.
- `evidence.type`은 `VERIFIED`, `STATED`, `HYPOTHESIS` 중 하나다. `source`는 근거, `confidence`는 `High`, `Medium`, `Low`, 또는 근거가 부족한 경우 `Unknown`이다.
- `unresolved_hypotheses`는 아직 확인되지 않은 추론과 확인 질문을 보존한다. 사용자가 확인하기 전 Map의 사실로 승격하지 않는다.
- `back_loop_required`에는 `workflow-decompose` 또는 `workflow-discover`로 돌아가야 하는 이유와 관련 Task/경계를 쓴다. Back Loop가 없으면 빈 배열이다.
- `open_questions`에는 해결되지 않은 질문만 기록한다. 필수 종료 조건이 미충족이면 완료를 선언하지 않는다.
- `next_stage`는 `workflow-map`과 지정된 초점을 유지한다. 해당 Skill이 아직 구현되지 않았으면 그 사실을 사용자에게 알린다.
- 유효한 JSON만 출력한다. 주석, 후행 쉼표, JSON 바깥 설명을 파일에 포함하지 않는다.

## Task별 Knowledge & Decision Card

최종 대화 응답에서 중요한 Task에 한해 다음 항목을 카드나 표로 제공할 수 있다. 적용되지 않는 값은 `N/A`, 미확인은 `Unknown`이다.

```text
TASK
- Task ID:
- Task Name:

DECISION
- Decision:
- Cue/Signal:
- Rule/Heuristic:

KNOWLEDGE
- Required Knowledge:
- Data/Information:
- Knowledge Source:

REASONING
- Reasoning Pattern:

EXCEPTION
- Exception:
- Exception Trigger:

ESCALATION
- Escalation Condition:
- Escalation Target:

EVIDENCE
- Type:
- Source:
- Confidence:
```