(() => {
  const stageRenderers = new Map();

  function registerStageRenderer(stageId, renderer) {
    if (stageRenderers.has(stageId)) throw new Error(`Renderer already registered for stage: ${stageId}`);
    if (typeof renderer !== "function") throw new TypeError(`Renderer for stage ${stageId} must be a function`);
    stageRenderers.set(stageId, renderer);
  }

  function getStageRenderer(stageId) {
    const renderer = stageRenderers.get(stageId);
    if (!renderer) throw new Error(`No renderer registered for stage: ${stageId}`);
    return renderer;
  }

      function isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === "string") return value.trim().length === 0;
        if (Array.isArray(value)) return value.every(isEmpty);
        if (typeof value === "object") return Object.values(value).every(isEmpty);
        return false;
      }

      function el(tag, className = "", text = null) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== null && text !== undefined) node.textContent = String(text);
        return node;
      }

      function displayValue(value) {
        if (value === null || value === undefined || value === "") return "Unknown";
        if (Array.isArray(value)) return value.length ? value.map(displayValue).join(" · ") : "Unknown";
        if (typeof value === "object") {
          return Object.entries(value).filter(([, child]) => !isEmpty(child))
            .map(([key, child]) => `${key}: ${displayValue(child)}`).join(" · ") || "Unknown";
        }
        return String(value);
      }

      function makeSection(title, detail = "") {
        const section = el("section", "view-section");
        const heading = el("div", "section-heading");
        heading.append(el("h3", "", title));
        if (detail) heading.append(el("span", "", detail));
        section.append(heading);
        return section;
      }

      function renderStageIntro(data, stage) {
        const target = data.target_work || {};
        const title = target.work_name || target.name || "Target Work";
        const intro = el("header", "stage-intro");
        const copy = el("div");
        copy.append(el("p", "stage-kicker", `STAGE ${stage.number} · ${stage.label}`));
        copy.append(el("h2", "", title));
        if (target.purpose) copy.append(el("p", "", target.purpose));
        intro.append(copy, el("span", "stage-count", `${stage.number} / ${stage.total || "06"}`));

        const boundary = el("div", "boundary-band");
        const fields = [
          ["Trigger", target.trigger],
          ["Start", target.start_boundary],
          ["End", target.end_boundary],
          ["Output", target.expected_output]
        ];
        fields.forEach(([label, value]) => {
          const item = el("div", "boundary-item");
          item.append(el("span", "", label), el("strong", "", displayValue(value)));
          boundary.append(item);
        });
        return [intro, boundary];
      }

      function factGrid(facts) {
        const grid = el("div", "fact-grid");
        facts.filter(([, value]) => !isEmpty(value)).forEach(([label, value]) => {
          const fact = el("div");
          fact.append(el("span", "fact-label", label), el("div", "fact-value", displayValue(value)));
          grid.append(fact);
        });
        return grid;
      }

      function evidenceTag(type) {
        const label = type || "UNKNOWN";
        return el("span", `evidence-tag ${String(label).toLowerCase()}`, label);
      }

      function appendPlainItems(parent, items) {
        const values = Array.isArray(items) ? items : (isEmpty(items) ? [] : [items]);
        if (!values.length) {
          parent.append(el("div", "empty-note", "확인된 항목 없음"));
          return;
        }
        const list = el("ul", "plain-list");
        values.forEach((item) => list.append(el("li", "", displayValue(item))));
        parent.append(list);
      }

      function renderRawData(data) {
        const details = el("details", "raw-data");
        details.append(el("summary", "", "원본 데이터 보기"));
        const rawTree = el("div", "tree");
        Object.entries(data).forEach(([key, value]) => {
          if (isEmpty(value)) return;
          const row = renderValue(value, key, 0);
          if (row) rawTree.append(row);
        });
        details.append(rawTree);
        return details;
      }

      function renderQuestionSection(title, values) {
        const section = makeSection(title, `${Array.isArray(values) ? values.length : 0}건`);
        appendPlainItems(section, values);
        return section;
      }

      function renderValue(value, key, level) {
        if (Array.isArray(value) || (value !== null && typeof value === "object")) {
          const isArray = Array.isArray(value);
          const entries = isArray ? value : Object.entries(value).filter(([, child]) => !isEmpty(child));
          if (!entries.length) return null;

          const details = document.createElement("details");
          details.className = "json-group";
          if (level === 0) details.open = true;
          const summary = document.createElement("summary");
          const keyElement = document.createElement("span");
          keyElement.className = "json-key";
          keyElement.textContent = key;
          const count = document.createElement("span");
          count.className = "json-count";
          count.textContent = isArray ? `[${entries.length}]` : `{${entries.length}}`;
          summary.append(keyElement, count);
          const children = document.createElement("div");
          children.className = "json-children";

          if (isArray) {
            entries.forEach((child, index) => {
              const item = renderValue(child, `Item ${String(index + 1).padStart(2, "0")}`, level + 1);
              if (item) children.append(item);
            });
          } else {
            entries.forEach(([childKey, child]) => {
              const item = renderValue(child, childKey, level + 1);
              if (item) children.append(item);
            });
          }

          details.append(summary, children);
          return details;
        }

        const row = document.createElement("div");
        row.className = "json-row";
        const keyElement = document.createElement("span");
        keyElement.className = "json-key";
        keyElement.textContent = key;
        const valueElement = document.createElement("span");
        valueElement.className = "json-value";

        if (typeof value === "string") {
          valueElement.textContent = JSON.stringify(value);
          if (/^unknown$/i.test(value.trim())) valueElement.classList.add("unknown");
        } else if (typeof value === "number") {
          valueElement.textContent = String(value);
          valueElement.classList.add("number");
        } else if (typeof value === "boolean") {
          valueElement.textContent = String(value);
          valueElement.classList.add("boolean");
        } else {
          valueElement.textContent = "null";
          valueElement.classList.add("null");
        }

        row.append(keyElement, valueElement);
        return row;
      }

      function formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }

  window.WorkflowReader = {
    helpers: {
      isEmpty, el, displayValue, makeSection, renderStageIntro, factGrid, evidenceTag, appendPlainItems, renderRawData, renderQuestionSection, renderValue, formatBytes
    },
    registerStageRenderer,
    getStageRenderer
  };
})();
