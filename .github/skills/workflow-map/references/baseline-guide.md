# Baseline Guide

Baseline은 현행 Workflow의 개선 전 비교 기준이다. 사용자가 판단한 업무 성과나 문제가 아니라, 현재 관찰되거나 추정되는 값과 그 근거를 기록한다.

## 1. 측정 상태

각 Baseline 항목은 다음 중 하나로 표시한다.

- `MEASURED`: 로그, 시스템 기록, 설문 결과, 시간기록 등 실제 측정 자료가 있음
- `ESTIMATED`: 사용자의 경험적 추정, 근사치 또는 기록이 없는 반복 패턴
- `UNKNOWN`: 값이나 근거를 현재 확인할 수 없음

Evidence Type(`VERIFIED`, `STATED`, `HYPOTHESIS`)과 Measurement Status는 별도다. 예를 들어 사용자가 경험을 바탕으로 “월 5~8회 정도”라고 말한 Frequency는 `ESTIMATED`이며, Evidence는 `STATED`일 수 있다.

`Unknown`을 0으로 바꾸거나 범위값의 중간을 사실처럼 계산하지 않는다. 사용자에게서 듣지 않은 값은 채우지 않는다.

## 2. 적용할 수 있는 Metric

업무에 의미 있는 지표만 고른다.

| Metric | 경계 및 단위 |
|---|---|
| Frequency | 기간당 업무 발생 횟수 (예: 월 N회) |
| Lead Time | Trigger부터 End까지 경과 시간. 달력 시간인지 영업 시간인지 구분 가능하면 기록 |
| Touch Time | 사람이 실제 작업한 시간. 대기 시간을 포함하지 않음 |
| Wait Time | 회신·승인·시스템 처리 등 기다린 시간 |
| Human Touch | 사람이 개입한 실제 Task 수 또는 횟수. Actor가 미확인인 경우 임의 계산하지 않음 |
| Rework | 수정·재검토·재처리 횟수 또는 비율과 분모 |
| Error | 오류·실패 횟수 또는 비율과 분모 |

## 3. 측정 근거와 Measurement Plan

각 항목은 `current_value`, `measurement_status`, `evidence`, `measurement_plan`을 가진다.

- `MEASURED`: 측정 출처와 기간/분모를 기록한다. 사용자 제공 자료가 없으면 실측이라고 주장하지 않는다.
- `ESTIMATED`: 누구의 추정인지, 대략적인 기간/범위가 무엇인지 적는다.
- `UNKNOWN`: 이유를 간단히 기록하고, Stage 5 이후 비교에 의미가 있으면 수집 계획을 제안한다.
- 이미 로그나 기록으로 충분히 측정된 항목에는 중복 Measurement Plan이 필요하지 않으면 `N/A`로 둔다.

측정 계획 예:

```text
Metric: 평균 승인 대기시간
Current Value: Unknown
Measurement Status: UNKNOWN
Evidence: 승인 요청/완료 시각을 모은 자료가 아직 없음
Measurement Plan: 다음 10건의 요청 시각과 승인 완료 시각을 기록
```

측정 계획은 관찰 방법만 제안한다. 목표값이나 개선 효과를 정하지 않는다.

## 4. Baseline 해석 경계

- 수치가 크거나 오래 걸린다고 병목·낭비라고 말하지 않는다.
- 조사 응답, 전체 대상자 수, 접속자 수 등 분모가 다르면 구분해 기록한다.
- 사용자가 추정한 전체 경과기간을 Touch Time으로 바꾸지 않는다.
- 입력된 Stage 1 Frequency/effort는 기존 Evidence와 근사를 보존한다.
- 비교할 수 없는 단위는 환산하거나 합치지 않는다.