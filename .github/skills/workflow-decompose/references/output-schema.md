# Decompose Output Schema

사용자가 Task Tree를 실제 사례와 대조하고 확인한 뒤에만 최종 결과를 확정한다. 저장 파일은 `workflow-output/decompose-result.json`이다. Stage 1 파일은 읽기만 하고 수정하거나 덮어쓰지 않는다.

## JSON 템플릿

```json
{
  "schema_version": "1.0",
  "framework_stage": "decompose",
  "source_stage": "discover",
  "role_context": {},
  "target_work": {
    "name": "Unknown",
    "purpose": "Unknown",
    "start_boundary": "Unknown",
    "end_boundary": "Unknown",
    "trigger": "Unknown",
    "expected_output": "Unknown"
  },
  "task_tree": [],
  "decision_points": [],
  "knowledge_markers": [],
  "exception_markers": [],
  "evidence_status": {
    "verified": [],
    "stated": [],
    "hypothesis": []
  },
  "open_questions": [],
  "next_stage": {
    "skill": "workflow-deep-dive",
    "focus": [
      "decision criteria",
      "required knowledge",
      "reasoning",
      "exceptions",
      "expert tacit knowledge"
    ]
  }
}
```

## 필드 규칙

- `role_context`: Discover 결과의 객체를 그대로 복사한다. 직접 입력 방식이면 사용자가 제공한 값만 넣고, 미상인 경우 `{}` 또는 제공된 키의 `Unknown`을 쓴다.
- `target_work.name`: Discover `target_work.work_name`에서 매핑한다. 사용자 직접 입력이면 사용자가 지정한 명칭을 쓴다.
- `target_work.purpose`: Discover Target Work에 목적이 있으면 매핑한다. Discover 스키마에 목적 필드가 없을 수 있으므로 `work_inventory`의 동일 `work_id` 항목에 목적이 있으면 그 값을 사용한다. 사용자가 Stage 2에서 목적을 추가 설명하면 그 진술을 반영한다. 출처를 알 수 없거나 값이 없으면 `Unknown`.
- 나머지 `target_work` 경계 필드는 Discover의 같은 이름 필드에서 매핑한다. `expected_output`은 Discover `target_work.expected_output`을 매핑한다. 없는 값은 사용자 확인 없이는 보충하지 않고 `Unknown`으로 둔다.
- `task_tree`는 순서가 있는 Task 객체 배열이다. 각 객체는 `task_id`, `name`, `level`(1, 2 또는 선택적 3), `parent_task_id`(Level 1은 `null`), `sequence`, `evidence_type`, `sub_tasks`를 포함한다. 하위 항목은 같은 구조를 재귀적으로 따른다. 확인된 Task에 필요한 경우 `input`, `output`, `condition`, `parallel`, `repeats`를 추가한다. 알 수 없는 optional 값은 만들지 않는다.
- `decision_points`는 `id`, `task_id`, `description`, `evidence_type`으로 구성한다. 판단의 존재와 위치만 기록하고 기준·이유는 넣지 않는다.
- `knowledge_markers`는 `id`, `task_id`, `description`, `evidence_type`으로 구성한다. 사용자가 언급한 단서만 저장한다.
- `exception_markers`는 `id`, `task_id`, `description`, `evidence_type`으로 구성한다. 예외의 존재와 간단한 설명만 저장하고 처리 로직은 넣지 않는다.
- `evidence_status.verified`, `.stated`, `.hypothesis`에는 해당 Task/Marker ID와 간단한 근거 또는 확인 질문을 넣는다. 확인 전 가설은 확정 `task_tree`에서 제외한다. 가설을 확인해 채택하면 근거에 맞춰 `VERIFIED` 또는 `STATED`로 이동한다.
- `open_questions`에는 미해결 질문과 완료 상태를 기록한다. 종료 조건에 필수인 미해결 사항이 있으면 Stage 완료/최종 저장을 선언하지 않는다.
- 모든 미확인 필드는 문자열 `Unknown`으로 표현한다. 사용자가 말하지 않은 Input/Output/순서/조건을 임의 작성하지 않는다.
- 유효한 JSON만 출력한다. 주석, 후행 쉼표, JSON 바깥의 설명을 파일 안에 넣지 않는다.

## Discover 입력 매핑 예

Discover 결과의 `target_work`가 다음처럼 생긴 경우:

```json
{
  "work_id": "W-01",
  "work_name": "외부 테크블로그 기반 내부 특강 발굴·섭외·진행",
  "user_selected": true,
  "start_boundary": "수시로 테크블로그를 살펴보다 회사의 고민과 맞는 후보 주제를 발견하는 시점",
  "end_boundary": "KT 내부 특강을 실제 진행한 시점",
  "trigger": "외부 테크블로그 수시 탐색 중 회사의 고민과 일치하는 주제 후보 발견",
  "expected_output": "KT 내부 특강 진행"
}
```

Stage 2 `target_work.name`은 `work_name`에서 가져오고, 나머지 경계 필드는 같은 이름으로 매핑한다. 목적은 연결된 `work_inventory` 항목 또는 사용자 확인에서만 가져온다. 예시 데이터는 Stage 2 Task의 근거가 아니며 Task Tree는 인터뷰 전 비워 둔다.