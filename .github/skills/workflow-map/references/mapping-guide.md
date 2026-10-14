# Mapping Guide

이 문서는 Stage 1~3 결과를 실제 End-to-End As-Is 흐름으로 연결하는 방법을 정의한다. Map은 입력에 기록되지 않은 절차를 보충하거나 현재 업무를 재설계하지 않는다.

## 1. 경계와 시작점

우선 Stage 1 `target_work`의 `trigger`, `start_boundary`, `end_boundary`, `expected_output`을 읽는다.

- Trigger는 업무가 시작된 사건이다.
- Start는 관찰할 업무 범위의 첫 행동 또는 시작 상태다.
- End와 Output은 Target Work의 종료 경계와 기대 산출물에 맞춘다.
- 필드가 서로 다르거나 경계가 충돌하면 임의로 조정하지 말고 사용자에게 확인한다.

## 2. Task를 Node로 연결

1. Stage 2 `task_tree`의 ID, 부모 관계, sequence, condition, input, output을 보존한다.
2. Stage 3 `knowledge_decision_map`에서 동일 Task ID의 Decision, cues, rule, knowledge, exceptions, escalation, evidence를 연결한다.
3. Stage 1 `work_id`를 찾을 수 있으면 각 주요 Node의 `source_refs`에 연결한다.
4. 부모 Task가 묶음이고 하위 Task가 구체 행동이면 하위 Task를 표현하고 부모 ID도 lineage에 남긴다. 부모 행동이 독립된 실제 단계면 별도 Node로 표현한다.
5. Task의 순서가 명시됐거나 실제 Walk-through로 확인되면 Edge를 만든다. 단순 배열 순서를 실제 전이로 단정하지 않는다.

한 Source Task는 여러 Node에 걸쳐 표현될 수 있지만, 각 Node에 원 Task ID를 남긴다. 서로 다른 Task의 의미를 하나의 Node로 합치지 않는다.

## 3. Decision과 Branch

Decision Node에는 가능한 경우 Stage 3의 결정 기준을 연결한다. Branch label과 조건은 사용자가 확인한 표현만 사용한다.

```text
[D1] 자료가 충분한가?
  Yes -> 다음 Task
  No  -> 추가 자료 요청 -> [WAIT] 회신 대기 -> 다시 검토
```

입력에 한 분기만 나타나면 반대 분기를 만들어내지 않는다. 사용자에게 확인하거나 `open_questions`에 남긴다. `HYPOTHESIS`는 확인 전 확정 Branch로 표시하지 않는다.

## 4. Handoff와 Wait

다음과 같은 실제 전달을 Handoff 후보로 본다: 공유, 전달, 요청, 회신, 승인, 협의, 시스템 입력/출력.

가능한 경우 기록할 항목:

- 전달하는 Actor와 받는 Actor
- 넘기는 정보 또는 산출물
- 수신자 응답이 다음 Task의 전제인지 여부
- 전달 후 실제 대기가 있는지, 대기 대상이 누구/무엇인지
- Wait가 끝나는 조건과 확인된 시간

단순한 순차 처리와 Wait를 혼동하지 않는다. Wait 자체가 실제로 확인되지 않으면 추가하지 않는다. 시간이 자료에 없으면 `Unknown`이고, 추정할 경우 `ESTIMATED`와 근거를 함께 표시한다.

## 5. Loop

수정·재검토·추가 요청 등 반복이 입력 또는 Walk-through에서 확인되면 Loop로 표시한다.

- 반복을 촉발하는 사건
- 되돌아가는 Task 또는 Decision
- 반복 횟수와 근거 (모르면 `Unknown`)
- 정상 흐름으로 합류하는 위치
- 종료 조건 (확인되지 않으면 `Unknown`)

예상되는 재작업을 실제 Loop로 표현하지 않는다.

## 6. Exception과 Escalation

Stage 3에서 확인된 Exception을 정상 경로와 구분하고 `trigger`, 실제로 달라지는 경로, 알려진 rejoin 지점을 연결한다. 재합류 지점이 불명확하면 만들지 않는다.

Escalation은 일반적인 전달과 다르다. 사용자가 직접 판단하지 않고 권한자나 전문가에게 판단/처리를 넘겼다고 말한 경우에만 표현한다. 다음 정보를 사용자 진술 범위에서 기록한다:

- Escalation condition
- 실제 target Actor
- 함께 전달하는 정보
- 결과가 돌아오는지와 이후 흐름

## 7. Actor, System, Knowledge, Evidence

- Actor는 사용자가 말한 역할 또는 시스템 이름만 기록한다. 확정되지 않은 수행자는 `Unknown`이다.
- System/Tool은 실제 사용이 언급된 경우에만 기록한다.
- Knowledge/Data는 별도 Task Node로 만들지 않고 관련 Node의 속성으로 연결한다.
- Stage 1~3의 Evidence Type과 Source ID를 보존한다.
- Map 과정에서 새로 확인한 연결은 그 연결에 해당하는 Evidence Type과 Source를 기록한다.
- 사용자가 아직 확인하지 않은 추론은 `HYPOTHESIS`로 두고 사실 경로에 확정하지 않는다.

## 8. Flow Completeness

Node Table과 Diagram을 만들고 다음을 점검한다.

- Trigger에서 Start로, 주요 Task와 Decision을 거쳐 Output/End까지 경로가 있는가?
- 모든 분기에서 실제 확인된 다음 단계가 있는가?
- 각 Edge에 근거가 있는가?
- Task가 어느 곳에도 연결되지 않은 이유를 설명할 수 있는가?
- Wait, Loop, Exception의 진입·복귀·종료가 확인됐는가?
- 여러 채널(온라인/오프라인) 흐름은 입력에 있는 조건만으로 분리했는가?

불명확한 곳을 Diagram의 임의 Edge로 숨기지 않는다. 질문 또는 `open_questions`를 사용한다.