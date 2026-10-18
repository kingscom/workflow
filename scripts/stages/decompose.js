(() => {
  const { isEmpty, el, displayValue, makeSection, renderStageIntro, factGrid, evidenceTag, appendPlainItems, renderRawData, renderQuestionSection, renderValue, formatBytes } = window.WorkflowReader.helpers;

      function renderDecompose(data, page) {
        const tasks = data.task_tree || [];
        const section = makeSection("실제 작업 순서", `${tasks.length}개 상위 Task`);
        section.append(renderTaskList(tasks));
        page.append(section);

        const markerSection = makeSection("판단·지식·예외 포인트");
        const strip = el("div", "marker-strip");
        strip.append(markerColumn("Decision", data.decision_points), markerColumn("Knowledge", data.knowledge_markers), markerColumn("Exception", data.exception_markers));
        markerSection.append(strip, renderQuestionSection("미해결 질문", data.open_questions));
        page.append(markerSection);
      }

      function renderTaskList(tasks) {
        const list = el("ol", "flow-list");
        tasks.forEach((task) => {
          const item = el("li", "task-item");
          const card = el("article", "task-card");
          const title = el("div", "task-title-row");
          title.append(el("span", "task-sequence", task.sequence || "•"), el("h4", "", task.name || "Task"), el("span", "task-id", task.task_id || ""));
          card.append(title);
          const facts = [];
          if (task.input) facts.push(`입력: ${displayValue(task.input)}`);
          if (task.output) facts.push(`산출: ${displayValue(task.output)}`);
          if (task.condition) facts.push(`조건: ${displayValue(task.condition)}`);
          if (task.repeats) facts.push(`반복: ${displayValue(task.repeats)}`);
          if (task.evidence_type) facts.push(`근거: ${task.evidence_type}`);
          if (facts.length) card.append(el("p", "task-facts", facts.join("  /  ")));
          item.append(card);
          if (task.sub_tasks && task.sub_tasks.length) {
            const children = el("div", "task-children");
            children.append(renderTaskList(task.sub_tasks));
            item.append(children);
          }
          list.append(item);
        });
        return list;
      }

      function markerColumn(title, markers) {
        const column = el("section", "marker-column");
        const entries = markers || [];
        column.append(el("h4", "", `${title} · ${entries.length}`));
        if (!entries.length) column.append(el("div", "empty-note", "없음 또는 미기록"));
        entries.forEach((marker) => {
          const item = el("article", "marker-item");
          const top = el("div", "card-topline");
          top.append(el("span", "id-tag", marker.id || marker.task_id || "Marker"), evidenceTag(marker.evidence_type));
          item.append(top, el("p", "", marker.description || marker.decision || ""));
          column.append(item);
        });
        return column;
      }

  window.WorkflowReader.registerStageRenderer("decompose", renderDecompose);
})();
