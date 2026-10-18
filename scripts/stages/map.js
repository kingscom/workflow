(() => {
  const { isEmpty, el, displayValue, makeSection, renderStageIntro, factGrid, evidenceTag, appendPlainItems, renderRawData, renderQuestionSection, renderValue, formatBytes } = window.WorkflowReader.helpers;

      function renderMap(data, page) {
        const workflow = data.workflow || {};
        const nodes = workflow.nodes || [];
        const edges = workflow.edges || [];
        const taskTree = data.task_tree || [];
        const overview = makeSection("상위 Task Overview", `${taskTree.length}개 상위 Task`);
        overview.append(renderTaskOverview(taskTree));
        page.append(overview);

        const section = makeSection("As-Is 연결 흐름", `${nodes.length}개 Node · ${edges.length}개 연결`);
        section.append(renderFlowchart(workflow, taskTree));
        page.append(section);

        const baseline = makeSection("Baseline", `${(data.baseline || []).length}개 지표`);
        const tiles = el("div", "baseline-grid");
        (data.baseline || []).forEach((metric) => {
          const tile = el("article", `metric-tile ${String(metric.measurement_status || "unknown").toLowerCase()}`);
          const head = el("div", "metric-head");
          head.append(el("strong", "", metric.metric || "Metric"));
          head.append(el("span", `status-tag ${String(metric.measurement_status || "unknown").toLowerCase()}`, metric.measurement_status || "UNKNOWN"));
          tile.append(head, el("div", "metric-value", displayValue(metric.current_value)));
          if (metric.evidence) tile.append(el("p", "metric-evidence", `근거 · ${displayValue(metric.evidence)}`));
          if (metric.measurement_plan) tile.append(el("p", "metric-plan", `측정 방법 · ${displayValue(metric.measurement_plan)}`));
          tiles.append(tile);
        });
        baseline.append(tiles);
        page.append(baseline);

        const support = makeSection("전달·반복·예외");
        const supportGrid = el("div", "map-support-grid");
        supportGrid.append(collectionCard("Handoffs", workflow.handoffs, (item) => `${item.from_actor || "Unknown"} → ${item.to_actor || "Unknown"} · ${displayValue(item.information)}`));
        supportGrid.append(collectionCard("Loops", workflow.loops, (item) => `${item.trigger || item.loop_id} · 반복 ${displayValue(item.repeat_count)}`));
        supportGrid.append(collectionCard("Exceptions", workflow.exceptions, (item) => `${item.trigger || item.exception_id} · 재합류 ${displayValue(item.rejoin_node_id)}`));
        supportGrid.append(collectionCard("Waits / Escalations", [...(workflow.waits || []), ...(workflow.escalations || [])], displayValue));
        support.append(supportGrid, renderQuestionSection("확인 필요", data.open_questions));
        page.append(support);
      }

      function renderTaskOverview(taskTree) {
        const overview = el("div", "task-overview");
        taskTree.forEach((task) => {
          const item = el("article", `task-overview-item group-${task.task_id}`);
          const heading = el("div", "task-overview-head");
          heading.append(el("span", "task-overview-id", task.task_id));
          heading.append(el("h4", "", task.name || "상위 Task"));
          item.append(heading);
          if (task.output) item.append(el("p", "task-overview-output", `산출 · ${task.output}`));

          const steps = el("ul", "task-overview-steps");
          const appendSteps = (tasks) => {
            tasks.forEach((subtask) => {
              if (subtask.sub_tasks?.length) {
                appendSteps(subtask.sub_tasks);
                return;
              }
              const step = el("li", "task-overview-step");
              step.append(el("span", "", subtask.task_id), el("div", "", subtask.name || "하위 Task"));
              steps.append(step);
            });
          };
          appendSteps(task.sub_tasks || []);
          if (steps.childElementCount) item.append(steps);
          overview.append(item);
        });
        return overview;
      }

      function makeTaskGroupMap(taskTree, nodes) {
        const groupByTask = new Map();
        const assignGroup = (tasks, groupId) => {
          tasks.forEach((task) => {
            if (task.sub_tasks?.length) assignGroup(task.sub_tasks, groupId);
            else groupByTask.set(task.task_id, groupId);
          });
        };
        taskTree.forEach((group) => assignGroup(group.sub_tasks || [], group.task_id));

        const groupByNode = new Map();
        nodes.forEach((node) => {
          const taskRef = (node.source_refs || []).find((ref) => ref.type === "task_id");
          const groupId = taskRef && groupByTask.get(taskRef.value);
          if (groupId) groupByNode.set(node.node_id, groupId);
        });
        return groupByNode;
      }

      function renderFlowchart(workflow, taskTree) {
        const nodes = workflow.nodes || [];
        const edges = workflow.edges || [];
        const nodeById = new Map(nodes.map((node) => [node.node_id, node]));
        const groupByNode = makeTaskGroupMap(taskTree, nodes);
        const outgoing = new Map();
        const incoming = new Set(edges.map((edge) => edge.to));
        edges.forEach((edge) => {
          if (!outgoing.has(edge.from)) outgoing.set(edge.from, []);
          outgoing.get(edge.from).push(edge);
        });

        const chart = el("div", "flowchart");
        const visited = new Set();
        const start = nodes.find((node) => node.node_type === "TRIGGER");
        if (start) chart.append(renderFlowNode(start.node_id, nodeById, outgoing, visited, new Set(), groupByNode));

        const remaining = nodes.filter((node) => !visited.has(node.node_id));
        if (remaining.length) {
          const subsection = el("section", "flowchart-subsection");
          subsection.append(el("h4", "", "연결이 확인된 별도 구간 · 미연결 Node"));
          const pendingIds = new Set(remaining.map((node) => node.node_id));
          const hasPendingPredecessor = new Set(edges
            .filter((edge) => pendingIds.has(edge.from) && pendingIds.has(edge.to))
            .map((edge) => edge.to));
          const starts = remaining.filter((node) => !hasPendingPredecessor.has(node.node_id));
          starts.sort((left, right) => Number((outgoing.get(right.node_id) || []).length > 0) - Number((outgoing.get(left.node_id) || []).length > 0));
          const detachedChart = el("div", "flowchart");
          starts.forEach((node) => {
            if (visited.has(node.node_id)) return;
            if (!incoming.has(node.node_id)) detachedChart.append(flowStartGap(node));
            detachedChart.append(renderFlowNode(node.node_id, nodeById, outgoing, visited, new Set(), groupByNode));
          });
          remaining.forEach((node) => {
            if (!visited.has(node.node_id)) detachedChart.append(renderFlowNode(node.node_id, nodeById, outgoing, visited, new Set(), groupByNode));
          });
          subsection.append(detachedChart);
          chart.append(subsection);
        }
        return chart;
      }

      function flowStartGap(node) {
        return el("div", "flow-unlinked-start", `선행 연결 없음 · ${node.node_id} ${node.activity} · 이 Node로 들어오는 Edge가 Map에 기록되지 않음`);
      }

      function renderFlowNode(nodeId, nodeById, outgoing, visited, ancestors, groupByNode) {
        const node = nodeById.get(nodeId);
        if (!node) return el("div", "flow-stop", `Node 정보를 찾을 수 없음 · ${nodeId}`);

        visited.add(nodeId);
        const branch = el("div", "flow-node-wrap");
        branch.append(flowchartNodeCard(node, groupByNode.get(nodeId)));
        const nextAncestors = new Set(ancestors);
        nextAncestors.add(nodeId);

        const connections = outgoing.get(nodeId) || [];
        const forward = connections.filter((edge) => !nextAncestors.has(edge.to) && !visited.has(edge.to));
        const returns = connections.filter((edge) => nextAncestors.has(edge.to));
        const joins = connections.filter((edge) => !nextAncestors.has(edge.to) && visited.has(edge.to));

        returns.forEach((edge) => branch.append(flowReturn(edge, nodeById)));
        joins.forEach((edge) => branch.append(flowJoin(edge, nodeById)));

        if (node.node_type === "DECISION" && forward.length === 1) {
          const choices = el("div", "flow-branches");
          const knownLane = el("div", "flow-branch");
          knownLane.append(el("span", "flow-branch-label", forward[0].label || forward[0].condition || "기록된 분기"));
          knownLane.append(flowConnector(forward[0], false));
          knownLane.append(renderFlowNode(forward[0].to, nodeById, outgoing, visited, nextAncestors, groupByNode));
          const unknownLane = el("div", "flow-branch");
          unknownLane.append(el("span", "flow-branch-label", "다른 분기 경로 미기록"));
          unknownLane.append(el("div", "flow-stop", "조건과 후속 Node 확인 필요"));
          choices.append(knownLane, unknownLane);
          branch.append(choices);
        } else if (forward.length === 1) {
          branch.append(flowConnector(forward[0]));
          branch.append(renderFlowNode(forward[0].to, nodeById, outgoing, visited, nextAncestors, groupByNode));
        } else if (forward.length > 1) {
          const choices = el("div", "flow-branches");
          forward.forEach((edge) => {
            const lane = el("div", "flow-branch");
            lane.append(el("span", "flow-branch-label", edge.label || edge.condition || "분기"));
            lane.append(flowConnector(edge, false));
            lane.append(renderFlowNode(edge.to, nodeById, outgoing, visited, nextAncestors, groupByNode));
            choices.append(lane);
          });
          branch.append(choices);
        } else if (!returns.length && !joins.length && node.node_type !== "END" && node.node_type !== "OUTPUT") {
          branch.append(el("div", "flow-stop", "다음 연결이 Map에 기록되지 않음"));
        }
        return branch;
      }

      function flowchartNodeCard(node, groupId) {
        const groupClass = groupId ? ` group-${groupId}` : "";
        const card = el("div", `flowchart-node ${String(node.node_type || "").toLowerCase()}${groupClass}`);
        card.append(el("small", "", `${node.node_id} · ${node.node_type}${groupId ? ` · ${groupId}` : ""}`));
        card.append(el("strong", "", node.activity || "활동 설명 없음"));
        return card;
      }

      function flowConnector(edge, includeLabel = true) {
        const connector = el("div", "flow-connector");
        const label = edge.label || edge.condition;
        if (includeLabel && label) connector.append(el("span", "flow-connector-label", label));
        if (edge.evidence?.type) connector.append(el("span", "flow-evidence", edge.evidence.type));
        connector.append(el("span", "flow-connector-arrow", "↓"));
        return connector;
      }

      function flowReturn(edge, nodeById) {
        const target = nodeById.get(edge.to);
        return el("div", "flow-backlink", `↶ ${edge.label || "반복"} · 다시 ${target?.node_id || edge.to} (${target?.activity || "Node"})`);
      }

      function flowJoin(edge, nodeById) {
        const target = nodeById.get(edge.to);
        return el("div", "flow-join", `↗ ${edge.label || "합류"} · 앞서 표시한 ${target?.node_id || edge.to}로 연결`);
      }

      function mapNodeCard(node, fallbackId) {
        const type = node?.node_type || "UNKNOWN";
        const kind = type.toLowerCase();
        const card = el("div", `map-node ${kind}`);
        card.append(el("small", "", `${node?.node_id || fallbackId} · ${type}`));
        card.append(el("strong", "", node?.activity || "Node 정보 없음"));
        return card;
      }

      function collectionCard(title, items, formatter) {
        const card = el("article", "support-card");
        card.append(el("h4", "", `${title} · ${items?.length || 0}`));
        if (!items?.length) card.append(el("div", "empty-note", "해당 항목 없음"));
        else items.forEach((item) => card.append(el("div", "support-item", formatter(item))));
        return card;
      }

  window.WorkflowReader.registerStageRenderer("map", renderMap);
})();
