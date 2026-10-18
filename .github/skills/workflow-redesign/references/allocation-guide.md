# Role Allocation Guide

## 기본 원칙과 검토 순서

ECRS를 적용하고 사용자가 Simplified Workflow Draft를 확인한 다음, 남아 있는 각 Task의 수행방식을 검토한다. 아래 순서는 판단 가이드이지 강제 자동분류 규칙이 아니다.

1. **Human**
2. **Rule**
3. **Existing System** (`SYSTEM`)
4. **Automation**
5. **AI**
6. **Agent**

AI/Agent를 시작점이나 기본값으로 삼지 않는다. 이미 제거·단순화 가능한 업무를 자동화하지 않는다.

## Task별 확인 기준

가능한 범위에서 Task마다 다음을 묻는다. 모르는 사실은 `UNKNOWN`으로 둔다.

- **Rule Clarity:** 명확하고 설명 가능한 If/Then 규칙이 있는가?
- **Variability:** 입력과 상황의 변동성이 어느 정도인가?
- **Unstructured Information:** 문서, 자연어, 이미지 등 비정형 정보를 이해해야 하는가?
- **Reasoning Complexity:** 맥락 해석·추론·생성이 필요한가?
- **Data / Knowledge Availability:** 필요한 데이터와 Knowledge에 실제 접근 가능한가?
- **Frequency / Volume:** 반복 빈도와 처리량이 충분한가?
- **Error Risk / Reversibility:** 오류 영향은 어떠하며 되돌릴 수 있는가?
- **Accountability:** 최종 책임이나 판단은 사람이 져야 하는가?
- **Integration Feasibility:** 필요한 시스템, API, Connector, 권한이 실제로 존재하는가?

## 수행방식별 판단 단서

| Allocation | 우선 고려할 조건 | 확인할 점 |
|---|---|---|
| `HUMAN` | 책임성·윤리·정책 판단이 높음, 협상·관계, 모호한 목표, 새 예외 | 어떤 판단을 사람이 보유해야 하는가 |
| `RULE` | 반복적이고 조건이 명확하며 입력이 안정적, 설명가능성 중요 | 규칙의 소유자·예외·갱신 조건 |
| `SYSTEM` | 필요한 기능이 기존 시스템에 존재 | 해당 기능, 데이터, 권한에 실제 접근 가능한가 |
| `AUTOMATION` | 반복적·결정적이며 구조화된 Input과 명확한 절차 | 통합·오류처리·실행권한이 가능한가 |
| `AI` | 비정형 정보의 요약·분류·추출·생성, 의미 검색, 맥락 기반 판단지원이 필요 | 근거 데이터·Knowledge, 품질검증, 오류 영향과 사람의 통제 |
| `AGENT` | 여러 단계를 Tool로 수행하고 상태를 유지하며 환경에 따라 다음 행동을 결정해야 함 | Agent가 아닌 단순 AI/Prompt/Automation으로 충분하지 않은 이유 |
| `ELIMINATED` | ECRS에서 제거가 확인되고 사용자 동의함 | 제거 이후 Output, Risk, Control이 유지되는가 |

## Why AI / Why Not AI

AI 또는 Agent를 후보로 배치할 때 다음을 설명한다.

- Rule로 충분하지 않은 이유
- Existing System에 이미 있는 기능만으로 부족한지
- 일반 Automation으로 충분하지 않은 이유
- AI가 제공해야 하는 구체적인 능력
- 실제 사용할 데이터·Knowledge와 접근 가능성
- AI가 틀렸을 때의 영향, 검증방법, HITL/Control

AI를 사용하지 않는 경우에도 필요하면 `Why Not AI`를 기록한다. 예: 자격 기준이 명확한 If/Then이므로 일관성·설명가능성이 중요한 Task는 `RULE`이 적절할 수 있다. 근거 없이 AI 적용 가능성을 부풀리거나, 존재하지 않는 API/Connector를 가정하지 않는다.

AI 능력 참고 범주는 Classification, Extraction, Summarization, Generation, Semantic Search, Comparison, Pattern Interpretation, Recommendation Support다. 이 목록은 이해를 돕기 위한 참고이며, Task에 자동으로 적용하는 근거가 아니다.

## Allocation Table

최종 표에는 다음 필드를 포함한다.

| Field | 설명 |
|---|---|
| Task ID / As-Is Task | 기존 ID와 현재 작업 |
| ECRS Decision | 앞서 사용자 확인한 ECRS 결과 |
| To-Be Task | 변경 후 작업 |
| Allocation / Why | 수행 주체와 근거 |
| Required Data / Knowledge | 실제 존재 여부가 확인된 필요자료 |
| Risk | 오류·책임·운영 위험 |
| HITL / Control Point | 필요 여부와 통제 방식 |
| Related Opportunity | Stage 5 Opportunity ID |

## Solution Parking Lot

Stage 5의 아이디어는 먼저 채택하지 않는다. ECRS와 Allocation 후에도 적합한지 검토하고 각각 `ACCEPTED`, `MODIFIED`, `REJECTED`, `HOLD` 중 하나와 이유를 기록한다. 채택 여부와 상관없이 미검증 제안은 검증 완료로 표현하지 않는다.
