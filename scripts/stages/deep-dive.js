(() => {
  const { isEmpty, el, displayValue, makeSection, renderStageIntro, factGrid, evidenceTag, appendPlainItems, renderRawData, renderQuestionSection, renderValue, formatBytes } = window.WorkflowReader.helpers;

      function renderDeepDive(data, page) {
        const entries = data.knowledge_decision_map || [];
        const coverage = makeSection("Deep Dive 판단 카드", `${entries.length}개 Task`);
        const ribbon = el("div", "rating-row");
        entries.forEach((entry) => ribbon.append(el("span", "rating-chip", entry.task_id || "Task")));
        coverage.append(ribbon);
        const grid = el("div", "decision-grid");
        entries.forEach((entry) => grid.append(renderDecisionCard(entry)));
        coverage.append(grid);
        page.append(coverage);

        const support = makeSection("검토가 필요한 항목");
        support.append(renderQuestionSection("미해결 질문", data.open_questions));
        support.append(renderQuestionSection("미확인 가설", data.unresolved_hypotheses));
        support.append(renderQuestionSection("Back Loop", data.back_loop_required));
        page.append(support);
      }

      function renderDecisionCard(entry) {
        const card = el("article", "decision-card");
        const topline = el("div", "card-topline");
        topline.append(el("span", "id-tag", entry.task_id || "Task"), evidenceTag(entry.evidence?.type));
        card.append(topline, el("h4", "", entry.decision || "Decision 미기록"));
        card.append(el("p", "decision-meta", `근거 신뢰도: ${entry.evidence?.confidence || "Unknown"}`));

        const details = el("div", "detail-columns");
        details.append(detailBlock("Cue / Signal", entry.cues));
        details.append(detailBlock("Rule / Heuristic", entry.rule_or_heuristic));
        details.append(detailBlock("Required Knowledge", entry.required_knowledge));
        details.append(detailBlock("Data Sources", entry.data_sources));
        details.append(detailBlock("Reasoning", entry.reasoning));
        details.append(detailBlock("Evidence Source", entry.evidence?.source));
        card.append(details);

        if (entry.exceptions?.length) {
          const exceptionWrap = el("div", "exception-note");
          exceptionWrap.append(el("strong", "", `예외 ${entry.exceptions.length}건`));
          entry.exceptions.forEach((exception) => {
            if (exception.trigger) exceptionWrap.append(el("p", "", `Trigger: ${displayValue(exception.trigger)}`));
            if (exception.handling) exceptionWrap.append(el("p", "", `처리: ${displayValue(exception.handling)}`));
            if (exception.details) exceptionWrap.append(el("p", "", displayValue(exception.details)));
            if (exception.examples) exceptionWrap.append(el("p", "", `예: ${displayValue(exception.examples)}`));
          });
          card.append(exceptionWrap);
        }

        const escalation = entry.escalation || {};
        if (!isEmpty(escalation)) card.append(detailBlock("Escalation", `조건: ${displayValue(escalation.condition)} / 대상: ${displayValue(escalation.target)}`));
        return card;
      }

      function detailBlock(title, value) {
        const block = el("div", "detail-block");
        block.append(el("h5", "", title));
        if (Array.isArray(value)) appendPlainItems(block, value);
        else block.append(el("p", "", displayValue(value)));
        return block;
      }

  window.WorkflowReader.registerStageRenderer("deep-dive", renderDeepDive);
})();
