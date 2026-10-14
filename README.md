# Workflow Transformation Framework

이 저장소는 실제 업무를 단계적으로 구조화하고, 이후 개선·구현에 필요한 정보를 다음 단계로 넘기기 위한 GitHub Copilot Agent Skills를 제공합니다. 각 단계는 사용자가 확인한 업무 정보만 사용하며, 이전 단계의 결과를 다음 단계 입력으로 전달합니다.

## 8단계 프레임워크

| 단계 | Skill | 목적 | 상태 |
|---|---|---|---|
| 1. Discover | `workflow-discover` | 사용자의 역할과 실제 업무를 파악하고, 사용자가 분석할 Target Work와 경계를 선택하도록 돕습니다. | 사용 가능 |
| 2. Decompose | `workflow-decompose` | 최근 실제 사례를 Work → Task → Sub-task로 분해하고, 사용자가 Task Tree를 확인하도록 돕습니다. | 사용 가능 |
| 3. Deep Dive | `workflow-deep-dive` | 실제 사례를 통해 판단 단서, 기준, 지식, 추론, 예외, Escalation을 근거 기반으로 외재화합니다. | 사용 가능 |
| 4. Map | `workflow-map` | Stage 1~3 결과를 연결해 As-Is 흐름, 분기, handoff, 반복 및 baseline을 구조화합니다. | 사용 가능 |
| 5. Diagnose | `workflow-diagnose` | Map과 Baseline을 바탕으로 pain point, bottleneck, root cause와 검증된 개선 기회를 분석합니다. | Skill 미작성 |
| 6. 정의 예정 | 미정 | 범위와 산출물이 아직 정의되지 않았습니다. | 미작성 |
| 7. 정의 예정 | 미정 | 범위와 산출물이 아직 정의되지 않았습니다. | 미작성 |
| 8. 정의 예정 | 미정 | 범위와 산출물이 아직 정의되지 않았습니다. | 미작성 |

현재 저장소에서 사용할 수 있는 Skill은 1~4단계입니다. Stage 5 `workflow-diagnose`는 Map Handoff의 다음 단계로 지정되어 있지만 Skill은 아직 작성되지 않았습니다. Stage 6~8의 이름과 책임은 확정되지 않았으므로, 이 README는 이를 임의로 추정하지 않습니다.

## 시작하기

이 저장소가 포함된 워크스페이스를 VS Code에서 열고 Copilot Chat에서 다음처럼 요청합니다. Skill을 직접 지정하면 해당 단계의 인터뷰를 시작할 수 있습니다.

### 1단계: Discover

`workflow-discover`를 실행하거나, 예를 들어 “내가 하는 업무를 발굴하고 분석할 대상을 정하고 싶습니다”라고 요청합니다.

- 실제로 수행하는 업무를 인터뷰하고, 사용자가 Target Work를 직접 선택하도록 합니다.
- 사용자가 최종 결과를 확인한 뒤 `workflow-output/discover-result.json`을 생성합니다.
- 결과에는 역할 맥락, 업무 목록, Target Work 경계, 근거 상태와 남은 질문이 포함됩니다.

### 2단계: Decompose

Discover 완료 후 `workflow-decompose`를 실행하거나, 예를 들어 “선택한 Target Work를 실제 사례에 따라 분해하고 싶습니다”라고 요청합니다.

- `workflow-output/discover-result.json`을 읽고 선택된 Target Work를 이어받습니다.
- 최근 실제 사례를 중심으로 행동을 수집하며, AI가 일반적인 업무 절차를 만들어 넣지 않습니다.
- Task Tree를 사용자가 실제 사례와 비교해 확인한 뒤 Task Inventory와 Handoff를 제공합니다.
- Handoff 확인 후 `workflow-output/decompose-result.json`을 생성합니다.

Discover 결과가 없더라도 사용자가 구체적인 Target Work와 경계를 제공하면 Decompose를 직접 시작할 수 있습니다. 대상 자체를 고르지 못했거나 범위가 너무 넓다면 먼저 Discover를 진행합니다.

### 3단계: Deep Dive

Decompose 완료 후 `workflow-deep-dive`를 실행하거나, 예를 들어 “Task Tree의 판단 Marker를 실제 사례 중심으로 Deep Dive 하고 싶습니다”라고 요청합니다.

- `workflow-output/decompose-result.json`에서 Target Work, Task Tree, Decision·Knowledge·Exception Marker를 읽습니다.
- 최근 실제 사건을 중심으로 Cue, 판단 기준, 필요한 지식·데이터, 추론, 예외 및 Escalation을 질문합니다.
- 모든 Task를 같은 깊이로 분석하지 않으며, AI가 일반지식을 사용자 암묵지로 보충하지 않습니다.
- 사용자가 Tacit Knowledge & Decision Map과 Handoff를 확인한 뒤 `workflow-output/deep-dive-result.json`을 생성합니다.

### 4단계: Map

Deep Dive 완료 후 `workflow-map`을 실행하거나, 예를 들어 “Stage 1~3 결과를 연결해 현재 업무 흐름과 Baseline을 Map으로 만들고 싶습니다”라고 요청합니다.

- `workflow-output/deep-dive-result.json`을 우선 읽고 필요한 경우 `decompose-result.json`, `discover-result.json`을 참조합니다.
- 앞 단계의 Task ID와 Evidence를 유지하며 실제 Task, Decision, Branch, Handoff, Wait, Loop, Exception을 End-to-End As-Is Workflow로 연결합니다.
- 먼저 초안을 만든 뒤 불확실한 연결만 질문하고, 최근 실제 사례 Walk-through로 순서와 누락을 확인합니다.
- Baseline은 `MEASURED`, `ESTIMATED`, `UNKNOWN`을 구분합니다. Stage 4에서는 진단, 재설계 또는 자동화 제안을 하지 않습니다.
- 사용자가 Workflow와 Map Handoff를 확인한 뒤 `workflow-output/map-result.json`을 생성합니다.

### 다음 단계

Deep Dive Handoff의 `next_stage`는 `workflow-map`을 지정합니다. Map Handoff의 `next_stage`는 `workflow-diagnose`를 지정합니다; Stage 5 Skill은 아직 작성되지 않았습니다.

## 산출물 연결

```text
workflow-output/
├── discover-result.json   # Stage 1 결과
├── decompose-result.json  # Stage 2 결과 및 Stage 3 입력
├── deep-dive-result.json  # Stage 3 결과 및 Stage 4 인계
└── map-result.json        # Stage 4 결과 및 Stage 5 인계
```

각 단계는 앞 단계의 결과를 읽되, 앞 단계 파일을 임의로 수정하거나 덮어쓰지 않습니다. 분해 과정에서 Discover 경계가 실제 업무와 다르다는 점이 드러나면 Discover로 되돌아가 사용자 확인 후 경계를 보정합니다.

## 원칙

- 업무 내용은 사용자의 실제 사례와 진술에 근거합니다. 추론은 확인 전까지 사실로 취급하지 않습니다.
- 사용자가 최종 Target Work와 결과물을 확인합니다.
- Discover와 Decompose는 현재 업무를 구조화하며, 성급한 진단·재설계·자동화 제안을 하지 않습니다.
- 미확인 정보는 `Unknown`으로 남기고, 판단 기준·상세 지식은 Deep Dive 단계로 넘깁니다.
- `workflow-output/`에는 역할 및 업무 정보가 담길 수 있습니다. 공유 저장소에 올리기 전에 민감 정보 포함 여부와 커밋 대상을 확인하세요.

## 저장소 구조

```text
.github/skills/
├── workflow-discover/
│   ├── SKILL.md
│   ├── references/
│   └── examples/
├── workflow-decompose/
    ├── SKILL.md
    ├── references/
    └── examples/
├── workflow-deep-dive/
    ├── SKILL.md
    ├── references/
    └── examples/
└── workflow-map/
    ├── SKILL.md
    ├── references/
    └── examples/
```

새 Stage Skill을 추가할 때는 `.github/skills/<skill-name>/SKILL.md`에 유효한 YAML frontmatter와 실행 지침을 작성하고, 이전 Stage의 입력 스키마 및 다음 Stage의 Handoff와 호환되는지 확인하세요. Stage를 구현한 뒤 이 README의 단계 표와 사용 방법을 갱신합니다.
