# Discover Output Schema

사용자가 최종 결과 초안을 확인한 뒤에만 결과를 확정한다. 다음 JSON은 구조 예시이며 빈 템플릿이다. 실제 사용자 정보로 채우고 모르는 값은 문자열 `Unknown`으로 기록한다. 확인되지 않은 해석은 확정 업무 목록에 넣지 말고 `evidence_status.hypotheses`에 명시한다.

```json
{
  "schema_version": "1.0",
  "role_context": {
    "role": "Unknown",
    "responsibility_scope": "Unknown",
    "organization_context": "Unknown"
  },
  "work_inventory": [
    {
      "work_id": "W-01",
      "work_name": "사용자가 확인한 업무명",
      "purpose": "Unknown",
      "trigger": "Unknown",
      "output": "Unknown",
      "frequency": "Unknown",
      "effort": "Unknown",
      "pain_rework": "Unknown",
      "evidence_type": "STATED",
      "prioritization": {
        "frequency": { "rating": "Unknown", "rationale": "근거 부족" },
        "effort": { "rating": "Unknown", "rationale": "근거 부족" },
        "pain_rework": { "rating": "Unknown", "rationale": "근거 부족" },
        "business_value": { "rating": "Unknown", "rationale": "근거 부족" },
        "improvement_potential": { "rating": "Unknown", "rationale": "근거 부족" }
      }
    }
  ],
  "target_work": {
    "work_id": "Unknown",
    "work_name": "Unknown",
    "user_selected": false,
    "start_boundary": "Unknown",
    "end_boundary": "Unknown",
    "trigger": "Unknown",
    "expected_output": "Unknown"
  },
  "selection_rationale": {
    "selected_reasons": [],
    "alternatives_considered": []
  },
  "evidence_status": {
    "verified_work_ids": [],
    "stated_work_ids": [],
    "hypotheses": []
  },
  "open_questions": []
}
```

## 필드 규칙

- `work_inventory`에는 사용자가 실제 수행한다고 확인한 업무만 둔다. 각 항목의 필수 필드는 `work_id`, `work_name`, `purpose`, `trigger`, `output`, `frequency`, `effort`, `pain_rework`, `evidence_type`다. 업무별 평가 근거가 있으면 `prioritization`을 포함한다.
- `evidence_type` 값은 `VERIFIED`, `STATED`, `HYPOTHESIS` 중 하나다. 미확인 가설은 확정 inventory에 추가하지 않는 것이 원칙이다. 필요한 경우 `evidence_status.hypotheses`에 대상, 가설, 확인 질문을 기록한다.
- `VERIFIED`는 사용자가 제공한 실제 자료 또는 구체 사례로 업무 내용이 확인된 경우만 사용한다. 사용자의 명시적 진술은 `STATED`다.
- 우선순위 `rating`은 `Low`, `Medium`, `High`, `Unknown` 중 하나다. 합계나 임의 점수를 추가하지 않는다. 등급을 뒷받침하는 짧은 근거를 `rationale`에 쓴다.
- `target_work.user_selected`는 사용자가 실제로 한 업무 하나를 선택한 경우에만 `true`다. 사용자가 고르지 않은 상태에서는 Target 확정을 완료로 표시하지 않는다.
- `alternatives_considered`는 각 후보의 업무 ID, 장점, 주의점 및 평가를 간결히 담는다. 후보가 없으면 빈 배열이며 AI가 후보 업무를 만들지 않는다.
- `open_questions`는 다음 단계 진행에 남은 질문만 담는다. 완료를 막는 질문이 남으면 Discover를 완료했다고 표시하지 않는다.
- JSON은 주석, 후행 쉼표, Markdown 텍스트를 포함하지 않는 유효한 JSON이어야 한다. 파일 저장이 불가하면 같은 JSON을 대화에 출력한다.

## Work Inventory 표시

대화 결과의 표 헤더는 `Work ID | Work Name | Purpose | Trigger | Output | Frequency | Effort | Pain/Rework | Evidence Type`으로 제공한다. 필드가 알려지지 않으면 `Unknown`으로 표시한다. 우선순위 평가는 별도 비교표로 제공할 수 있다.
