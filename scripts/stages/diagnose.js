(() => {
  const { isEmpty, el, displayValue, makeSection, evidenceTag, appendPlainItems, renderQuestionSection } = window.WorkflowReader.helpers;

  function renderDiagnose(data, page) {
    const problems = data.problems || [];
    const opportunities = data.opportunities || [];
    const baseline = data.baseline || [];

    if (data.no_significant_opportunity) {
      const notice = el("div", "diagnosis-callout");
      notice.append(el("strong", "", "확인된 유의미한 개선기회 없음"));
      notice.append(el("p", "", "현재 진단 범위에서 Opportunity를 확인하지 않았습니다."));
      page.append(notice);
    }

    const summary = makeSection("진단 요약", `${problems.length}개 Problem · ${opportunities.length}개 Opportunity`);
    const problemGrid = el("div", "work-grid");
    if (problems.length) problems.forEach((problem) => problemGrid.append(renderProblem(problem)));
    else problemGrid.append(el("div", "empty-note", "확인된 Problem이 없습니다."));
    summary.append(problemGrid);
    page.append(summary);

    const opportunitySection = makeSection("개선 Opportunity", `${opportunities.length}건`);
    const opportunityGrid = el("div", "work-grid");
    if (opportunities.length) opportunities.forEach((opportunity) => opportunityGrid.append(renderOpportunity(opportunity)));
    else opportunityGrid.append(el("div", "empty-note", "등록된 Opportunity가 없습니다."));
    opportunitySection.append(opportunityGrid);
    page.append(opportunitySection);

    const baselineSection = makeSection("진단 Baseline", `${baseline.length}개 지표`);
    const baselineGrid = el("div", "baseline-grid");
    baseline.forEach((metric) => baselineGrid.append(renderMetric(metric)));
    if (!baseline.length) baselineGrid.append(el("div", "empty-note", "Baseline 지표가 없습니다."));
    baselineSection.append(baselineGrid);
    page.append(baselineSection);

    const validationItems = data.validation_backlog || [];
    const validationSection = makeSection("검증 Backlog", `${validationItems.length}건`);
    const validationGrid = el("div", "work-grid");
    if (validationItems.length) validationItems.forEach((item) => validationGrid.append(renderValidation(item)));
    else validationGrid.append(el("div", "empty-note", "남은 검증 항목이 없습니다."));
    validationSection.append(validationGrid);
    page.append(validationSection);

    const followUp = makeSection("제약·후속 확인");
    const followUpGrid = el("div", "map-support-grid");
    followUpGrid.append(collectionCard("Constraints", problems.flatMap((problem) => problem.constraints || [])));
    followUpGrid.append(collectionCard("Back Loop", data.back_loop_required));
    followUp.append(followUpGrid, renderQuestionSection("미해결 질문", data.open_questions));
    page.append(followUp);
  }

  function renderProblem(problem) {
    const card = el("article", "decision-card diagnosis-card");
    const top = el("div", "card-topline");
    top.append(el("span", "id-tag", problem.problem_id || "Problem"));
    card.append(top);
    if (problem.problem_statement) card.append(el("h4", "", problem.problem_statement));
    appendTextBlock(card, "관찰", problem.observation);

    const pains = problem.pain_points || [];
    if (pains.length) {
      const painBlock = el("div", "detail-block diagnosis-block");
      painBlock.append(el("h5", "", "Pain Point"));
      appendPlainItems(painBlock, pains.map((pain) => (
        typeof pain === "string" ? pain : [pain.description, pain.scope && `범위: ${pain.scope}`].filter(Boolean).join(" · ")
      )));
      card.append(painBlock);
    }

    const causes = problem.root_causes || [];
    if (causes.length) {
      const causeSection = el("div", "diagnosis-subsection");
      causeSection.append(el("h5", "", "Root Cause"));
      causes.forEach((cause) => causeSection.append(renderRootCause(cause)));
      card.append(causeSection);
    }
    const evidence = problem.observation_evidence || [];
    if (evidence.length) {
      const evidenceSection = el("div", "diagnosis-subsection");
      evidenceSection.append(el("h5", "", "관찰 근거"));
      evidence.forEach((item) => evidenceSection.append(renderEvidence(item)));
      card.append(evidenceSection);
    }
    return card;
  }

  function renderRootCause(cause) {
    const item = el("article", "support-card diagnosis-root-cause");
    const head = el("div", "card-topline");
    head.append(
      el("span", "id-tag", cause.root_cause_id || "Root Cause"),
      el("span", `status-tag ${String(cause.status || "unknown").toLowerCase()}`, cause.status || "UNKNOWN"),
      el("span", `evidence-tag ${String(cause.evidence_strength || "unknown").toLowerCase()}`, cause.evidence_strength || "UNKNOWN")
    );
    item.append(head);
    if (cause.description) item.append(el("p", "diagnosis-copy", cause.description));
    if (cause.evidence?.length) {
      const evidenceList = el("div", "diagnosis-evidence-list");
      cause.evidence.forEach((evidence) => evidenceList.append(renderEvidence(evidence)));
      item.append(evidenceList);
    }
    appendTextBlock(item, "검증 계획", cause.validation_plan);
    return item;
  }

  function renderEvidence(item) {
    const card = el("div", "diagnosis-evidence");
    const head = el("div", "card-topline");
    head.append(evidenceTag(item.evidence_type || item.type));
    if (item.evidence_strength) {
      head.append(el("span", `status-tag ${String(item.evidence_strength).toLowerCase()}`, item.evidence_strength));
    }
    card.append(head);
    if (item.description) card.append(el("p", "", item.description));
    const metadata = [item.source, item.source_refs?.length && `참조: ${item.source_refs.join(", ")}`].filter(Boolean);
    if (metadata.length) card.append(el("small", "", metadata.join(" · ")));
    return card;
  }

  function renderOpportunity(opportunity) {
    const card = el("article", "decision-card diagnosis-card");
    const top = el("div", "card-topline");
    top.append(
      el("span", "id-tag", opportunity.opportunity_id || "Opportunity"),
      el("span", `status-tag ${String(opportunity.priority || "hold").toLowerCase()}`, `Priority ${opportunity.priority || "HOLD"}`)
    );
    card.append(top);
    if (opportunity.description) card.append(el("h4", "", opportunity.description));
    const facts = [
      ["Problem", opportunity.related_problem],
      ["Root Cause", opportunity.related_root_causes],
      ["Impact", opportunity.impact],
      ["Frequency / Reach", opportunity.frequency_or_reach],
      ["Evidence", opportunity.evidence_strength],
      ["Addressability", opportunity.addressability],
      ["Validation", opportunity.validation_status]
    ];
    card.append(renderFactGrid(facts));
    if (opportunity.expected_improvement?.length) {
      const expected = el("div", "detail-block diagnosis-block");
      expected.append(el("h5", "", "기대 개선"));
      appendPlainItems(expected, opportunity.expected_improvement);
      card.append(expected);
    }
    if (opportunity.related_baseline?.length) {
      const baseline = el("div", "detail-block diagnosis-block");
      baseline.append(el("h5", "", "연결 Baseline"));
      appendPlainItems(baseline, opportunity.related_baseline.map((item) => (
        `${item.metric}: ${displayValue(item.current_value)} (${item.measurement_status || "UNKNOWN"})`
      )));
      card.append(baseline);
    }
    return card;
  }

  function renderMetric(metric) {
    const status = String(metric.measurement_status || "UNKNOWN").toLowerCase();
    const tile = el("article", `metric-tile ${status}`);
    const head = el("div", "metric-head");
    head.append(
      el("strong", "", metric.metric || "Metric"),
      el("span", `status-tag ${status}`, metric.measurement_status || "UNKNOWN")
    );
    tile.append(head, el("div", "metric-value", displayValue(metric.current_value)));
    if (metric.evidence) tile.append(el("p", "metric-evidence", `근거 · ${displayValue(metric.evidence)}`));
    if (metric.measurement_plan) tile.append(el("p", "metric-plan", `측정 방법 · ${displayValue(metric.measurement_plan)}`));
    return tile;
  }

  function renderValidation(item) {
    const card = el("article", "support-card diagnosis-card");
    const top = el("div", "card-topline");
    top.append(
      el("span", "id-tag", item.hypothesis_id || "Validation"),
      el("span", `status-tag ${String(item.status || "not_started").toLowerCase()}`, item.status || "NOT_STARTED")
    );
    card.append(top);
    appendTextBlock(card, "확인할 내용", item.what_to_validate);
    appendTextBlock(card, "중요한 이유", item.why_important);
    const facts = [
      ["방법", item.validation_method],
      ["담당", item.owner],
      ["Problem", item.related_problem],
      ["Root Cause", item.related_root_cause]
    ];
    card.append(renderFactGrid(facts));
    if (item.required_evidence?.length) {
      const required = el("div", "detail-block diagnosis-block");
      required.append(el("h5", "", "필요 근거"));
      appendPlainItems(required, item.required_evidence);
      card.append(required);
    }
    return card;
  }

  function collectionCard(title, items) {
    const card = el("article", "support-card");
    card.append(el("h4", "", title));
    const values = (items || []).map((item) => {
      if (typeof item === "string") return item;
      if (item.description && item.reason) return `${item.stage || ""} · ${item.reason}`;
      return displayValue(item);
    });
    appendPlainItems(card, values);
    return card;
  }

  function appendTextBlock(parent, title, value) {
    if (isEmpty(value)) return;
    const block = el("div", "detail-block diagnosis-block");
    block.append(el("h5", "", title), el("p", "", displayValue(value)));
    parent.append(block);
  }

  function renderFactGrid(facts) {
    const grid = el("div", "fact-grid");
    facts.filter(([, value]) => !isEmpty(value)).forEach(([label, value]) => {
      const fact = el("div");
      fact.append(el("span", "fact-label", label), el("div", "fact-value", displayValue(value)));
      grid.append(fact);
    });
    return grid;
  }

  window.WorkflowReader.registerStageRenderer("diagnose", renderDiagnose);
})();
