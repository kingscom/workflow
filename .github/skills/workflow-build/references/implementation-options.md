# Implementation Options

Stage 6 Allocation을 보존하며 그에 맞는 Prototype 실행체를 선택한다. 가장 단순하면서 가설과 Acceptance Criteria를 검증할 수 있는 방법을 사용한다.

## Allocation별 구현

| Allocation | 적합한 산출물 예시 |
|---|---|
| `HUMAN` | SOP, Checklist, Review Flow |
| `RULE` | 조건문, Validation Logic, Decision Table |
| `SYSTEM` | 확인된 기존 기능의 설정 또는 사용 명세 |
| `AUTOMATION` | Script, RPA, Workflow Engine Prototype |
| `AI` | Prompt, Structured Output, Extraction, Summarization, RAG 등 |
| `AGENT` | Tool-using 또는 다단계 Agent Prototype |

Build 단계에서 Allocation을 임의로 변경하지 않는다. 변경이 필요하면 `BACK_LOOP_REQUIRED: workflow-redesign`으로 제안한다.

## 환경·Data·Context·Integration

구현 전 사용 가능한 개발환경, Model, 파일, Data Access, API/Connector, System Permission, Network 제한, Security Constraint 및 Test Environment를 확인한다.

- Data: 이름, 목적, 출처, 형식, 필수 여부, 접근 상태, 민감도, Mock 가능 여부
- Context: Policy, Manual, Template, Example, Historical Case, Reference Data, User Input 또는 System State의 출처·형식·최신성·접근·민감도
- Tool/Integration: 시스템, 목적, Action, Permission, Input/Output, Failure Mode, Mock Strategy

확인되지 않은 Data·Integration·Permission을 사용 가능하다고 표시하지 않는다. API Key, Password 등 자격 증명을 문서화하지 않는다. 실제 연동이 불가하면 Mock으로 핵심 가설을 검증할 수 있는지 확인한다.

## Agent, Multi-Agent 및 PRD

Allocation이 `AGENT`일 때만 Agent 설계를 구체화한다. 필요하면 다음 ABCD를 명시한다.

- **Awareness:** 인식해야 할 상황·정보
- **Brain:** 필요한 판단·추론
- **Conduct:** 수행할 Tool/Action
- **Derived Value:** 만들어야 할 업무가치

역할명이 여러 개라는 이유만으로 Multi-Agent를 사용하지 않는다. 역할별 Context/Tool/Permission 분리, 독립 Review, 단일 Agent로 다루기 어려운 복잡성 중 실질적 필요가 있어야 한다.

개발팀 Handoff, 여러 Component, API/System Integration, UI/서비스 개발 등 명세가 필요한 경우에만 PRD를 작성한다. 개인 Prompt/Skill Prototype에 PRD를 강제하지 않는다.

## 파일 구현 원칙

실제 코드 Prototype이 적합하고 작업공간에서 구현이 허용되면:

- 기존 Repository 구조와 코드·테스트 패턴을 먼저 확인한다.
- 불필요한 Framework·의존성을 추가하지 않고 작은 변경으로 구현한다.
- 기존 코드와 설정을 파괴하지 않는다.
- Test 가능한 구조로 작성하고 Mock과 실제 Integration을 분리한다.
- Secret을 하드코딩하지 않고 민감정보를 로그에 남기지 않는다.
- Production 환경을 직접 변경하거나 승인 없는 외부 Action을 실행하지 않는다.

구현 전 Plan을 보여주며, 계획에는 범위, 파일, 기술, Mock 경계, Test 방식 및 주요 Risk를 포함한다.
