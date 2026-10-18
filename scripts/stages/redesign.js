(() => {
  const { isEmpty, el, displayValue, makeSection, factGrid, appendPlainItems, renderQuestionSection } = window.WorkflowReader.helpers;

  function renderRedesign(data, page) {
    const gate = data.decision_gate || {};
    page.append(renderGateSummary(gate));

    const opportunitySection = makeSection("선택된 개선기회", `${(data.selected_opportunities || []).length}건`);
    const opportunityGrid = el("div", "work-grid");
    (data.selected_opportunities || []).forEach((opportunity) => {
      const card = el("article", "support-card redesign-card");
      const top = el("div", "card-topline");
      top.append(
        el("span", "id-tag", opportunity.opportunity_id || "Opportunity"),
        statusTag(opportunity.priority, `Priority ${opportunity.priority || "UNKNOWN"}`)
      );
      card.append(top);
      appendText(card, "description", opportunity.description);
      card.append(factGrid([
        ["Problem", opportunity.related_problem],
        ["Root Cause", opportunity.related_root_causes],
        ["검증 상태", opportunity.validation_status],
        ["근거 수준", opportunity.evidence_strength]
      ]));
      opportunityGrid.append(card);
    });
    if (!opportunityGrid.childElementCount) opportunityGrid.append(el("div", "empty-note", "선택된 Opportunity가 없습니다."));
    opportunitySection.append(opportunityGrid);
    page.append(opportunitySection);

    const ecrsSection = makeSection("ECRS Canvas", `${(data.ecrs || []).length}개 결정`);
    const ecrsGrid = el("div", "work-grid");
    (data.ecrs || []).forEach((item) => ecrsGrid.append(renderEcrs(item)));
    if (!ecrsGrid.childElementCount) ecrsGrid.append(el("div", "empty-note", "ECRS 결정이 없습니다."));
    ecrsSection.append(ecrsGrid);
    page.append(ecrsSection);

    const allocationSection = makeSection("Role Allocation", `${(data.allocation || []).length}개 작업`);
    const allocationGrid = el("div", "work-grid");
    (data.allocation || []).forEach((item) => allocationGrid.append(renderAllocation(item)));
    if (!allocationGrid.childElementCount) allocationGrid.append(el("div", "empty-note", "Allocation이 없습니다."));
    allocationSection.append(allocationGrid);
    page.append(allocationSection);

    const workflowSection = makeSection("To-Be Workflow", `${(data.to_be_workflow?.nodes || []).length}개 Node · ${(data.to_be_workflow?.edges || []).length}개 연결`);
    workflowSection.append(renderWorkflow(data.to_be_workflow || {}));
    page.append(workflowSection);

    const changeItems = data.as_is_to_be_change_map || [];
    const changeSection = makeSection("As-Is → To-Be Change Map", `${changeItems.length}개 변경`);
    const changeGrid = el("div", "work-grid");
    changeItems.forEach((item) => changeGrid.append(renderChange(item)));
    if (!changeGrid.childElementCount) changeGrid.append(el("div", "empty-note", "변경 연결이 없습니다."));
    changeSection.append(changeGrid);
    page.append(changeSection);

    const impactItems = data.expected_impact || [];
    const impactSection = makeSection("Expected Impact", `${impactItems.length}개 지표`);
    const impactGrid = el("div", "baseline-grid");
    impactItems.forEach((item) => impactGrid.append(renderImpact(item)));
    if (!impactGrid.childElementCount) impactGrid.append(el("div", "empty-note", "예상 영향이 없습니다."));
    impactSection.append(impactGrid);
    page.append(impactSection);

    const support = makeSection("제약·검토 및 후속 조치");
    const supportGrid = el("div", "map-support-grid");
    supportGrid.append(
      collectionCard("Constraints", data.constraints, (item) => `${item.constraint_type || "Other"} · ${item.description || displayValue(item)}`),
      collectionCard("Gate Conditions", gate.conditions),
      collectionCard("Open Risks", gate.open_risks),
      collectionCard("Parking Lot Review", data.solution_parking_lot_review)
    );
    support.append(supportGrid);
    support.append(renderQuestionSection("Open Questions", data.open_questions));
    support.append(renderQuestionSection("Back Loop Required", data.back_loop_required));
    page.append(support);
  }

  function renderGateSummary(gate) {
    const section = el("section", `redesign-gate ${normalized(gate.decision || "unknown")}`);
    const heading = el("div", "redesign-gate-heading");
    heading.append(
      el("div", "", "Value × Feasibility × Risk"),
      statusTag(gate.decision, gate.decision || "미결정")
    );
    section.append(heading);

    const ratings = el("div", "redesign-ratings");
    [
      ["Value", gate.value],
      ["Feasibility", gate.feasibility],
      ["Risk", gate.risk]
    ].forEach(([label, value]) => {
      const item = el("div", "redesign-rating");
      item.append(el("span", "", label), statusTag(value, value || "UNKNOWN"));
      ratings.append(item);
    });
    section.append(ratings);
    appendText(section, "decision-rationale", gate.decision_rationale);
    const owner = gate.decision_owner ? `최종 결정: ${gate.decision_owner}` : "";
    if (owner) section.append(el("p", "redesign-gate-owner", owner));
    return section;
  }

  function renderEcrs(item) {
    const card = el("article", "decision-card redesign-card");
    const top = el("div", "card-topline");
    top.append(
      el("span", "id-tag", item.ecrs_id || item.task_id || "ECRS"),
      statusTag(item.decision, item.decision || "UNKNOWN")
    );
    card.append(top, el("h4", "", item.task_id || "Task"));
    if (item.related_task_ids?.length) {
      card.append(el("p", "redesign-meta", `함께 검토 · ${item.related_task_ids.join(", ")}`));
    }
    appendText(card, "rationale", item.rationale);
    card.append(factGrid([
      ["Opportunity", item.related_opportunities],
      ["Problem", item.related_problems],
      ["Root Cause", item.related_root_causes]
    ]));
    return card;
  }

  function renderAllocation(item) {
    const card = el("article", "decision-card redesign-card");
    const top = el("div", "card-topline");
    top.append(
      el("span", "id-tag", item.task_id || "Task"),
      statusTag(item.allocation, item.allocation || "UNKNOWN")
    );
    card.append(top);
    if (item.task_scope) card.append(el("p", "redesign-meta", item.task_scope));
    if (item.to_be_task) card.append(el("h4", "", item.to_be_task));

    card.append(factGrid([
      ["Why", item.why],
      ["Required Data", item.required_data],
      ["Required Knowledge", item.required_knowledge],
      ["Risk", item.risk]
    ]));

    const hitl = item.hitl || {};
    if (hitl.required || item.control_points?.length) {
      const controls = el("div", "redesign-control-row");
      if (hitl.required) {
        controls.append(statusTag("HITL", `HITL · ${hitl.pattern || "필요"}`));
        if (hitl.condition) controls.append(el("span", "redesign-control-text", hitl.condition));
      }
      if (item.control_points?.length) controls.append(el("span", "redesign-control-text", `Control · ${item.control_points.join(", ")}`));
      card.append(controls);
    }
    card.append(factGrid([
      ["Opportunity", item.related_opportunity],
      ["ECRS", item.related_ecrs]
    ]));
    return card;
  }

  function renderWorkflow(workflow) {
    const wrap = el("div", "redesign-workflow");
    const nodes = workflow.nodes || [];
    const nodeById = new Map(nodes.map((node) => [node.node_id, node]));
    const mainNodes = nodes.filter((node) => node.node_type !== "EXCEPTION");
    const exceptionNodes = nodes.filter((node) => node.node_type === "EXCEPTION");

    const nodeSection = el("div", "redesign-node-grid");
    mainNodes.forEach((node) => nodeSection.append(renderWorkflowNode(node)));
    if (!mainNodes.length) nodeSection.append(el("div", "empty-note", "To-Be Node가 없습니다."));
    wrap.append(nodeSection);

    const edges = workflow.edges || [];
    const edgeSection = el("div", "redesign-edge-list");
    edgeSection.append(el("h4", "", "연결·분기"));
    edges.forEach((edge) => {
      const row = el("div", "redesign-edge");
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      row.append(
        el("span", "redesign-edge-node", `${edge.from} · ${from?.activity || "Node"}`),
        el("span", "redesign-edge-arrow", "→"),
        el("span", "redesign-edge-node", `${edge.to} · ${to?.activity || "Node"}`)
      );
      if (edge.condition) row.append(el("small", "redesign-edge-condition", edge.condition));
      edgeSection.append(row);
    });
    if (!edges.length) edgeSection.append(el("div", "empty-note", "Workflow 연결이 없습니다."));
    wrap.append(edgeSection);

    const support = el("div", "map-support-grid redesign-workflow-support");
    support.append(
      collectionCard("Exceptions", workflow.exceptions, (item) => `${item.exception_id || ""} · ${item.condition || ""} → ${item.handling || ""}`),
      collectionCard("Control Points", workflow.controls, (item) => `${item.control_id || ""} · ${item.type || ""} · ${item.condition || ""}`)
    );
    wrap.append(support);
    if (exceptionNodes.length) {
      const exceptionSection = el("div", "redesign-exception-list");
      exceptionSection.append(el("h4", "", "예외 Node"));
      exceptionNodes.forEach((node) => exceptionSection.append(renderWorkflowNode(node)));
      wrap.append(exceptionSection);
    }
    return wrap;
  }

  function renderWorkflowNode(node) {
    const card = el("article", `redesign-node ${normalized(node.node_type || "task")}`);
    const top = el("div", "card-topline");
    top.append(
      el("span", "id-tag", node.node_id || "Node"),
      statusTag(node.allocation, node.allocation || node.node_type || "TASK")
    );
    card.append(top, el("h4", "", node.activity || "Activity"));
    if (node.actor) card.append(el("p", "redesign-meta", `담당 · ${node.actor}`));
    const refs = node.source_refs || [];
    if (refs.length) card.append(el("p", "redesign-meta", `참조 · ${refs.join(", ")}`));
    return card;
  }

  function renderChange(item) {
    const card = el("article", "support-card redesign-card");
    const top = el("div", "card-topline");
    top.append(
      el("span", "id-tag", item.as_is_node || "As-Is"),
      statusTag(item.change_type, item.change_type || "UNKNOWN")
    );
    card.append(top);
    if (item.as_is_activity) card.append(el("p", "redesign-meta", `As-Is · ${item.as_is_activity}`));
    if (item.to_be_activity) card.append(el("p", "redesign-change-activity", item.to_be_activity));
    card.append(factGrid([
      ["To-Be Node", item.to_be_nodes],
      ["Allocation", item.allocation],
      ["Opportunity", item.related_opportunity]
    ]));
    return card;
  }

  function renderImpact(item) {
    const status = normalized(item.measurement_status || "UNKNOWN");
    const card = el("article", `metric-tile ${status}`);
    const top = el("div", "metric-head");
    top.append(
      el("strong", "", item.metric || "Metric"),
      statusTag(item.measurement_status, item.measurement_status || "UNKNOWN")
    );
    card.append(top);
    if (item.baseline) card.append(el("div", "metric-value", item.baseline));
    if (item.expected_direction) card.append(el("p", "redesign-impact-direction", `기대 방향 · ${item.expected_direction}`));
    if (!isEmpty(item.numeric_target)) card.append(el("p", "metric-plan", `수치 목표 · ${displayValue(item.numeric_target)}`));
    if (item.target_basis) card.append(el("p", "metric-evidence", `목표 근거 · ${item.target_basis}`));
    appendText(card, "metric-plan", item.measurement_plan);
    if (item.validation_status) card.append(statusTag(item.validation_status, `검증 · ${item.validation_status}`));
    return card;
  }

  function collectionCard(title, items, formatter = displayValue) {
    const card = el("article", "support-card");
    card.append(el("h4", "", title));
    const values = Array.isArray(items) ? items.map(formatter) : (isEmpty(items) ? [] : [formatter(items)]);
    appendPlainItems(card, values);
    return card;
  }

  function appendText(parent, className, value) {
    if (isEmpty(value)) return;
    parent.append(el("p", className, displayValue(value)));
  }

  function statusTag(value, label) {
    return el("span", `status-tag ${normalized(value || "unknown")}`, label);
  }

  function normalized(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }

  window.WorkflowReader.registerStageRenderer("redesign", renderRedesign);
})();
