# Diagnosis Guide

## Map 입력 품질

Stage 5 시작 전 `workflow-output/map-result.json`을 읽고 아래를 점검한다. 상태는 `CONFIRMED`, `PARTIAL`, `MISSING`, `UNKNOWN`처럼 간단히 기록하고 근거를 붙인다. 품질이 부족하면 빈 칸을 상식으로 채우지 않는다.

| 확인 영역 | 점검 질문 | 부족할 때 |
|---|---|---|
| Target Work | 역할, 목적, Trigger, 시작·종료 경계가 분석 대상을 특정하는가? | `workflow-discover` |
| Workflow 연결 | 중요한 Node가 End-to-End로 연결되고 주요 전이가 Walk-through 되었는가? | `workflow-map` |
| Task/Decision | 문제 후보가 원래 Task, Decision, Exception에 연결되는가? | Task 구조면 `workflow-decompose`; 판단정보면 `workflow-deep-dive` |
| Handoff/Wait/Loop | 왕복·대기·반복이 확인되었고 추정치와 사실이 구분되는가? | `workflow-map` 또는 원인 정보에 따라 이전 단계 |
| Baseline | 의미 있는 값이 있고 `MEASURED`/`ESTIMATED`/`UNKNOWN`이 구분되는가? | `workflow-map` |
| 사용자 확인 | As-Is가 최근 실제 사례와 대조되어 확인됐는가? | `workflow-map` |

일부 Baseline만 있는 것은 자동으로 중단 사유가 아니다. 진단하려는 성과를 측정할 수 없거나 비교 기준이 전혀 없을 때 부족한 지표를 구체화하고 Map Back Loop를 제안한다. 입력 품질이 낮아도 확실한 일부 정보만으로 Candidate scan을 할 수 있지만, 미검증 연결을 근거처럼 쓰지 않는다.

## Evidence Scan

다음 신호를 Stage 4 필드에서 탐색한다. 발견 내용은 `Candidate`이지 확정 Problem이 아니다.

| 신호 | 탐색 위치 | 가능한 Candidate |
|---|---|---|
| Time | `baseline`, `workflow.waits`, Edge 흐름, Task | 긴 Lead/Wait Time, Touch 대비 과다한 대기 |
| Rework | `workflow.loops`, `task_tree`, Handoff, open questions | 수정·재작성·재검토의 반복 |
| Error | Exception, Decision, 증거 상태, 사용자 사례 | 오류·누락·불일치·재처리 |
| Handoff | `workflow.handoffs`, Actor 변화, 대기 | 반복 확인·왕복·책임경계 불명확 가능성 |
| Manual Effort | Task, Node, `system_tool`, Baseline | 반복 입력·취합·비교·확인 가능성 |
| Decision | `knowledge_decision_map`, Decision Node, Escalation | 판단기준 편차·특정 역할 집중 가능성 |
| Exception | `workflow.exceptions`, Exception Node, escalation | 예외 빈도·처리 영향 가능성 |

각 Candidate에 `candidate_id`, 신호 유형, 관련 `work_id`/`task_id`/`node_id`, 관찰과 해석의 분리, 원본 Evidence 및 측정 상태, 확인 질문을 연결한다. Map에 없는 빈도·소요시간·재작업 건수는 만들지 않는다. 단순히 Wait가 존재한다는 이유로 Bottleneck이라 부르지 않는다.

## Observation, Pain, Problem

### Observation
사실 또는 출처가 붙은 보고를 구체적으로 적는다. 가능한 경우 기간, 건수, 분모, 단위, 측정 방법을 확인한다. 출처는 Map Baseline, Map Node/Edge, 사용자 진술, Artifact, 데이터 중 무엇인지 적는다. 확정되지 않은 내용은 Observation에 `HYPOTHESIS`를 섞지 않는다.

### Pain Point
수행자의 경험을 확인한다. 질문은 가장 중요한 한 가지부터 한다. 예:

- "이 흐름에서 실제로 가장 시간이 걸리거나 멈추는 곳은 어디인가요?"
- "최근 사례에서 반복해서 다시 하게 된 일은 무엇이었나요?"
- "가장 번거롭거나 스트레스가 큰 단계와 그 영향은 무엇인가요?"
- "이 불편이 매번 있나요, 특정 조건에서만 있나요?"

응답자의 역할·범위·사례를 기록한다. 한 사람의 경험을 전체 조직에 일반화하지 않는다.

### Problem Statement
확인된 Pain이 업무 결과에 영향을 주는 경우에만 다음 형식으로 함께 작성한다.

`[상황/Process]에서 [관찰된 현상] 때문에 [업무 영향]이 발생한다.`

특정 Workflow 구간과 관찰 가능한 현상, 업무 영향이 있어야 한다. 해결방법, 기술, AI/Agent를 포함하지 않는다. 영향이나 인과가 추정이면 `HYPOTHESIS:`로 표시하고 확인한다. 불편이 있어도 성과 문제가 확인되지 않았다면 Pain으로 기록하되 Problem을 과장하지 않는다.

## Challenge Mode

사용자의 원인 주장을 공격적으로 반박하지 말고 실제 사례로 검증한다. 필요하면 한 번에 하나씩 묻는다.

- "정말 원인일까요, 아니면 현재 보이는 증상일까요?"
- "최근 사례 여러 건에서도 같은 원인이 확인됐나요?"
- "그 원인이 없어도 같은 문제가 발생한 반례가 있나요?"
- "이 문제가 줄면 어떤 업무 성과가 달라질까요?"
- "이 원인은 조직이 바꿀 수 있나요, 아니면 제약조건인가요?"

개인 비난을 Process 조건, 정보, 규칙, 도구, 권한 등 검증 가능한 수준으로 구체화하되 근거 없이 원인을 대신 정하지 않는다.

## Opportunity

권장 문장:

`[대상 Workflow/Task]에서 [Root Cause]를 줄이거나 제거하여 [측정 가능한 성과]를 높일 기회`

각 Opportunity는 Problem ID, Root Cause ID, Work/Task/Node, 관련 Baseline, Evidence Strength 및 Validation 상태까지 추적 가능해야 한다. 해결책이 아니라 해결 가치가 있는 대상과 기대 개선을 표현한다. 지표가 UNKNOWN이면 측정계획을 연결한다.

Opportunity Quality Check:

1. 특정 Problem 및 Root Cause와 연결되는가?
2. Solution-neutral한가?
3. 성과가 측정 가능하거나 측정 계획이 있는가?
4. Target Work 범위 안에 있는가?
5. Evidence 또는 Validation Plan이 있는가?

조건이 부족한 후보는 `HOLD` 또는 Validation Backlog로 둔다. 의미 있는 후보가 없으면 `NO_SIGNIFICANT_OPPORTUNITY`로 마무리한다.
