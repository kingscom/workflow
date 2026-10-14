# Saturation Guide

Deep Dive는 Task마다 같은 깊이로 진행하거나 질문을 무한히 반복하지 않는다. 포화도는 전체 업무가 아니라 하나의 Decision/Knowledge 영역 단위로 판단한다.

## 우선 깊게 탐색할 영역

- Stage 2 Decision, Knowledge, Exception Marker가 있는 Task
- 사용자가 실제로 어렵거나 불확실하다고 말한 판단
- 결과 차이가 크거나 오류 영향이 큰 Task
- 예외 대응 또는 Escalation이 확인된 Task

Marker가 없더라도 대화 중 인지적 복잡성이 드러나면 탐색한다. 반대로 단순 전달·정형 입력처럼 낮은 복잡도의 Task는 최소한의 확인 후 넘어간다.

## 한 Decision/Knowledge 영역의 충분 조건

필요한 항목에 대해 다음이 실제 사례 또는 사용자 진술로 충분히 파악되면 해당 영역을 닫을 수 있다.

- 중요한 Cue/Signal
- Decision 및 사용자가 설명한 Rule/Heuristic
- 필요한 Knowledge/Data와 실제 Source
- Reasoning의 주요 흐름
- 주요 Exception 여부와 Exception Trigger
- 해당하는 경우 Escalation 조건과 대상
- 중요 내용의 Evidence Type

모든 영역에서 모든 항목이 적용되는 것은 아니다. 적용되지 않는다고 사용자가 확인한 것은 `N/A`, 아직 알 수 없는 것은 `Unknown`으로 구분한다.

## 포화 신호

- 같은 종류의 답변이 반복되고 새 Cue, 지식, 경계가 나오지 않음
- 사용자가 추가로 중요한 기준이나 예외가 없다고 확인함
- 남은 불확실성이 현재 분석 목적에 중요하지 않음
- 다음 질문이 이미 확인한 내용을 다른 말로 반복할 뿐임

포화가 의심되면 짧게 현재까지의 내용을 요약하고 빠진 핵심이 있는지 확인한다. 새로운 정보를 요구하기 위해 질문을 늘리지 않는다.

## 아직 포화되지 않은 경우

Decision 기준이 여전히 추상적이거나, 사용자가 예외/타인 확인을 언급했는데 Trigger·대상·전달 정보가 불명확하면 그 빈 곳 하나만 질문한다. 구조적 Task 누락이나 경계 오류라면 지식 질문으로 메우지 말고 `BACK_LOOP_REQUIRED`를 사용한다.

## 종료 판단

중요 영역의 포화, HYPOTHESIS의 명시적 분리, 사용자 검토를 모두 확인한다. 확인하지 못한 항목은 사실로 채우지 않고 Handoff의 `open_questions`에 남긴다. Stage 종료 조건의 필수 항목이 미충족이면 완료를 선언하지 않는다.