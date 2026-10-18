(() => {
  const { isEmpty, el, displayValue, makeSection, renderStageIntro, factGrid, evidenceTag, appendPlainItems, renderRawData, renderQuestionSection, renderValue, formatBytes } = window.WorkflowReader.helpers;

      function renderDiscover(data, page) {
        const targetWork = data.target_work?.user_selected ? data.target_work : null;
        const inventory = data.work_inventory || [];
        const detail = targetWork
          ? `${inventory.length}개 업무 · Target Work는 목록에서 강조 표시`
          : `${inventory.length}개 업무 · Target Work 미선정`;
        const section = makeSection("업무 인벤토리", detail);
        const grid = el("div", "work-grid");
        let targetMatched = false;
        inventory.forEach((work) => {
          const card = el("article", "work-card");
          const topline = el("div", "card-topline");
          const badges = el("div", "card-badges");
          const isTarget = Boolean(targetWork && (
            (targetWork.work_id && targetWork.work_id === work.work_id) ||
            (targetWork.work_name && targetWork.work_name === work.work_name)
          ));
          if (isTarget) {
            targetMatched = true;
            card.classList.add("is-target");
          }
          badges.append(evidenceTag(work.evidence_type));
          if (isTarget) badges.append(el("span", "target-badge", "Target Work"));
          topline.append(el("span", "id-tag", work.work_id || "ID 없음"), badges);
          card.append(topline, el("h4", "", work.work_name || "업무명 미기록"));
          if (work.purpose) card.append(el("p", "", work.purpose));
          card.append(factGrid([
            ["Trigger", work.trigger], ["Output", work.output], ["Frequency", work.frequency],
            ["Effort", work.effort], ["Pain / Rework", work.pain_rework]
          ]));

          const ratings = Object.entries(work.prioritization || {});
          if (ratings.length) {
            const ratingRow = el("div", "rating-row");
            ratings.forEach(([name, rating]) => {
              const chip = el("span", "rating-chip");
              chip.append(el("span", "", name.replaceAll("_", " ")), el("strong", "", displayValue(rating.rating)));
              ratingRow.append(chip);
            });
            card.append(ratingRow);
          }
          grid.append(card);
        });
        if (!inventory.length) grid.append(el("div", "empty-note", "확인된 업무가 없습니다."));
        section.append(grid);
        if (targetWork && inventory.length && !targetMatched) {
          section.append(el("div", "empty-note", "선택된 Target Work와 일치하는 인벤토리 항목을 찾을 수 없습니다."));
        }
        page.append(section);

        const rationale = data.selection_rationale || {};
        const support = makeSection("선정 근거와 확인 항목");
        const columns = el("div", "map-support-grid");
        columns.append(supportCard("선정 이유", rationale.selected_reasons), supportCard("비교 후보", rationale.alternatives_considered));
        support.append(columns);
        support.append(renderQuestionSection("미해결 질문", data.open_questions));
        page.append(support);
      }

      function supportCard(title, values) {
        const card = el("article", "support-card");
        card.append(el("h4", "", title));
        const items = Array.isArray(values) ? values : (isEmpty(values) ? [] : [values]);
        if (!items.length) card.append(el("div", "empty-note", "확인된 항목 없음"));
        else items.forEach((item) => card.append(el("div", "support-item", displayValue(item))));
        return card;
      }

  window.WorkflowReader.registerStageRenderer("discover", renderDiscover);
})();
