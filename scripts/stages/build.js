(() => {
  const { isEmpty, el, displayValue, makeSection, factGrid, appendPlainItems, renderQuestionSection } = window.WorkflowReader.helpers;

  function renderBuild(data, page) {
    const decision = data.build_decision || {};
    page.append(renderDecision(decision));

    if (data.build_hypothesis) {
      const hypothesis = makeSection("Build Hypothesis");
      hypothesis.append(el("div", "build-hypothesis", data.build_hypothesis));
      page.append(hypothesis);
    }

    renderScope(data.prototype_scope || {}, page);
    renderImplementation(data.implementation || {}, page);
    renderSteps(data.sop || [], page);
    renderAcceptanceCriteria(data.acceptance_criteria || [], page);
    renderTests(data.test_results || [], page);
    renderIssues(data.issues || [], page);
    renderPilotRequirements(data.pilot_requirements || {}, page);

    const followUp = makeSection("후속 조치");
    const followUpGrid = el("div", "map-support-grid");
    followUpGrid.append(
      collectionCard("Back Loop Required", data.back_loop_required),
      collectionCard("Build Conditions", decision.conditions)
    );
    followUp.append(followUpGrid, renderQuestionSection("Open Questions", data.open_questions || []));
    page.append(followUp);
  }

  function renderDecision(decision) {
    const status = normalized(decision.status || "unknown");
    const section = el("section", `build-decision ${status}`);
    const heading = el("div", "build-decision-head");
    heading.append(el("span", "", "Build Decision"), statusTag(decision.status, decision.status || "미결정"));
    section.append(heading);
    appendText(section, "build-decision-reason", decision.reason);
    return section;
  }

  function renderScope(scope, page) {
    const groups = [
      ["IN SCOPE", scope.in_scope],
      ["MOCK", scope.mock],
      ["OUT OF SCOPE", scope.out_of_scope]
    ];
    const section = makeSection("Prototype Scope");
    const grid = el("div", "build-scope-grid");
    groups.forEach(([title, items]) => {
      const column = el("section", "build-scope-column");
      column.append(el("h4", "", `${title} · ${(items || []).length}`));
      const list = el("div", "build-card-list");
      (items || []).forEach((item) => {
        const card = el("article", "build-item-card");
        card.append(el("h4", "", item.item || "Scope item"));
        if (item.related_to_be_node) card.append(el("p", "build-item-meta", `To-Be · ${item.related_to_be_node}`));
        card.append(factGrid([
          ["Reason", item.reason],
          ["Validation Purpose", item.validation_purpose]
        ]));
        list.append(card);
      });
      if (!list.childElementCount) list.append(el("div", "empty-note", "항목 없음"));
      column.append(list);
      grid.append(column);
    });
    section.append(grid);
    page.append(section);
  }

  function renderImplementation(implementation, page) {
    const section = makeSection("Implementation Specification");
    const grid = el("div", "build-card-list");
    const summary = el("article", "build-item-card");
    summary.append(el("h4", "", "구현 형태"));
    summary.append(factGrid([
      ["Type", implementation.type],
      ["Components", implementation.components]
    ]));
    grid.append(summary);

    const resources = [
      ["Data", implementation.data],
      ["Context", implementation.context],
      ["Tools", implementation.tools],
      ["Integrations", implementation.integrations],
      ["Constraints", implementation.constraints]
    ];
    const resourceGrid = el("div", "map-support-grid");
    resources.forEach(([title, items]) => resourceGrid.append(collectionCard(title, items)));
    grid.append(resourceGrid);
    if (isEmpty(implementation)) grid.append(el("div", "empty-note", "Implementation Specification이 없습니다."));
    section.append(grid);
    page.append(section);
  }

  function renderSteps(steps, page) {
    const section = makeSection("Executable SOP", `${steps.length}개 Step`);
    const list = el("div", "build-card-list");
    steps.forEach((step) => {
      const card = el("article", "build-item-card build-step");
      const top = el("div", "card-topline");
      top.append(el("span", "id-tag", step.step_id || "Step"), statusTag(step.actor, step.actor || "UNKNOWN"));
      card.append(top);
      if (step.related_to_be_node) card.append(el("p", "build-item-meta", `To-Be · ${step.related_to_be_node}`));
      if (step.action) card.append(el("h4", "", step.action));
      card.append(factGrid([
        ["Input", step.input],
        ["Tool / System", step.tool_system],
        ["Rule / Instruction", step.rule_instruction],
        ["Expected Output", step.expected_output],
        ["Decision", step.decision],
        ["Exception", step.exception],
        ["Escalation", step.escalation],
        ["Control", step.control]
      ]));
      list.append(card);
    });
    if (!list.childElementCount) list.append(el("div", "empty-note", "SOP가 없습니다."));
    section.append(list);
    page.append(section);
  }

  function renderAcceptanceCriteria(criteria, page) {
    const section = makeSection("Acceptance Criteria", `${criteria.length}개 기준`);
    const list = el("div", "build-card-list");
    criteria.forEach((item) => {
      const card = el("article", "build-item-card build-ac");
      const top = el("div", "card-topline");
      top.append(
        el("span", "id-tag", item.ac_id || "AC"),
        statusTag(item.result, item.result || "NOT_TESTED")
      );
      card.append(top);
      if (item.criterion) card.append(el("h4", "", item.criterion));
      card.append(factGrid([
        ["Related To-Be Node", item.related_to_be_node],
        ["Priority", item.priority],
        ["Test Method", item.test_method],
        ["Pass Condition", item.pass_condition],
        ["Evidence", item.evidence]
      ]));
      list.append(card);
    });
    if (!list.childElementCount) list.append(el("div", "empty-note", "Acceptance Criteria가 없습니다."));
    section.append(list);
    page.append(section);
  }

  function renderTests(tests, page) {
    const section = makeSection("Test Results", `${tests.length}개 Scenario`);
    const list = el("div", "build-card-list");
    tests.forEach((test) => {
      const card = el("article", "build-item-card build-test");
      const top = el("div", "card-topline");
      top.append(
        el("span", "id-tag", test.test_id || "Test"),
        statusTag(test.result, test.result || "NOT_TESTED")
      );
      card.append(top);
      if (test.scenario) card.append(el("h4", "", test.scenario));
      card.append(factGrid([
        ["Related AC", test.related_ac],
        ["Expected", test.expected],
        ["Actual", test.actual],
        ["Evidence", test.evidence],
        ["Issue", test.issue]
      ]));
      list.append(card);
    });
    if (!list.childElementCount) list.append(el("div", "empty-note", "Test 결과가 없습니다."));
    section.append(list);
    page.append(section);
  }

  function renderIssues(issues, page) {
    const section = makeSection("Issues", `${issues.length}건`);
    const list = el("div", "build-card-list");
    issues.forEach((issue) => {
      const card = el("article", "build-item-card build-issue");
      const top = el("div", "card-topline");
      top.append(el("span", "id-tag", issue.issue_id || "Issue"), statusTag(issue.type, issue.type || "UNKNOWN"));
      card.append(top);
      appendText(card, "build-item-copy", issue.description);
      list.append(card);
    });
    if (!list.childElementCount) list.append(el("div", "empty-note", "등록된 Issue가 없습니다."));
    section.append(list);
    page.append(section);
  }

  function renderPilotRequirements(requirements, page) {
    const section = makeSection("Pilot Requirements");
    section.append(factGrid([
      ["Target Users", requirements.target_users],
      ["Sample Size", requirements.sample_size],
      ["Duration", requirements.duration],
      ["Metrics", requirements.metrics],
      ["Controls", requirements.controls],
      ["Rollback", requirements.rollback]
    ]));
    page.append(section);
  }

  function collectionCard(title, items) {
    const card = el("article", "support-card");
    card.append(el("h4", "", title));
    const values = Array.isArray(items) ? items.map(displayValue) : (isEmpty(items) ? [] : [displayValue(items)]);
    appendPlainItems(card, values);
    return card;
  }

  function appendText(parent, className, value) {
    if (!isEmpty(value)) parent.append(el("p", className, displayValue(value)));
  }

  function statusTag(value, label) {
    return el("span", `status-tag ${normalized(value || "unknown")}`, label);
  }

  function normalized(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }

  window.WorkflowReader.registerStageRenderer("build", renderBuild);
})();
