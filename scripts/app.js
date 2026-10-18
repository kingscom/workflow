    (() => {
      const { helpers, getStageRenderer } = window.WorkflowReader;
      const { isEmpty, el, formatBytes, renderStageIntro, renderRawData } = helpers;
      const stages = [
        { id: "discover", file: "discover-result.json", label: "Discover", number: "01" },
        { id: "decompose", file: "decompose-result.json", label: "Decompose", number: "02" },
        { id: "deep-dive", file: "deep-dive-result.json", label: "Deep Dive", number: "03" },
        { id: "map", file: "map-result.json", label: "Map", number: "04" }
      ];

      const state = { outputs: [], activeId: null };
      const jsonFiles = document.getElementById("jsonFiles");
      const tabs = document.getElementById("tabs");
      const welcome = document.getElementById("welcome");
      const viewer = document.getElementById("viewer");
      const tree = document.getElementById("tree");
      const statusMessage = document.getElementById("statusMessage");
      const expandAll = document.getElementById("expandAll");
      const collapseAll = document.getElementById("collapseAll");

      document.getElementById("loadFiles").addEventListener("click", () => jsonFiles.click());
      document.getElementById("welcomeLoad").addEventListener("click", () => jsonFiles.click());
      jsonFiles.addEventListener("change", loadSelectedFiles);
      expandAll.addEventListener("click", () => tree.querySelectorAll("details").forEach((item) => { item.open = true; }));
      collapseAll.addEventListener("click", () => tree.querySelectorAll("details").forEach((item) => { item.open = false; }));
      document.getElementById("copyJson").addEventListener("click", copyActiveJson);

      async function loadSelectedFiles(event) {
        const files = Array.from(event.target.files || []);
        const relativePath = files.find((file) => file.webkitRelativePath)?.webkitRelativePath || "";
        const selectedFolder = relativePath.split("/")[0] || "선택한 폴더";
        event.target.value = "";
        const selected = stages.map((stage) => {
          const file = files.find((item) => item.name === stage.file);
          return file ? { stage, file } : null;
        }).filter(Boolean);

        const results = await Promise.all(selected.map(async ({ stage, file }) => {
          const text = await file.text();
          if (!text.trim()) return null;
          try {
            const data = JSON.parse(text);
            if (isEmpty(data)) return null;
            return { stage, file, text, data, error: null };
          } catch (error) {
            return { stage, file, text, data: null, error };
          }
        }));

        state.outputs = results.filter(Boolean);
        document.getElementById("folderLabel").textContent = state.outputs.length ? "불러온 폴더" : "표시할 산출물 없음";
        document.getElementById("folderName").textContent = state.outputs.length ? selectedFolder : "";
        document.getElementById("stateDot").classList.toggle("ready", state.outputs.length > 0);
        document.getElementById("fileCount").textContent = state.outputs.length ? `${state.outputs.length}개 단계 표시` : "";

        if (!state.outputs.length) {
          tabs.hidden = true;
          viewer.hidden = true;
          welcome.hidden = false;
          document.getElementById("emptyTitle").textContent = files.length ? "표시할 산출물이 없습니다" : "단계별 JSON을 불러오세요";
          document.getElementById("emptyMessage").textContent = files.length
            ? "선택한 폴더에서 내용이 있는 Stage JSON을 찾지 못했습니다."
            : "폴더 불러오기를 눌러 workflow-output 폴더를 선택하세요.";
          statusMessage.hidden = true;
          return;
        }

        document.getElementById("emptyTitle").textContent = "단계별 JSON을 불러오세요";
        statusMessage.hidden = true;
        state.activeId = state.outputs[0].stage.id;
        renderTabs();
        renderActive();
      }

      function renderTabs() {
        tabs.replaceChildren();
        for (const output of state.outputs) {
          const button = document.createElement("button");
          button.className = "tab";
          button.type = "button";
          button.id = `tab-${output.stage.id}`;
          button.role = "tab";
          button.setAttribute("aria-controls", "viewer");
          button.setAttribute("aria-selected", String(output.stage.id === state.activeId));
          button.tabIndex = output.stage.id === state.activeId ? 0 : -1;
          const number = document.createElement("span");
          number.className = "tab-number";
          number.textContent = output.stage.number;
          const label = document.createElement("span");
          label.textContent = output.stage.label;
          button.append(number, label);
          button.addEventListener("click", () => activate(output.stage.id));
          button.addEventListener("keydown", handleTabKeydown);
          tabs.append(button);
        }
        tabs.hidden = false;
      }

      function handleTabKeydown(event) {
        const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
        const current = buttons.indexOf(event.currentTarget);
        let next = current;
        if (event.key === "ArrowRight") next = (current + 1) % buttons.length;
        else if (event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = buttons.length - 1;
        else return;
        event.preventDefault();
        buttons[next].focus();
        activate(buttons[next].id.replace("tab-", ""));
      }

      function activate(id) {
        state.activeId = id;
        renderTabs();
        renderActive();
      }

      function renderActive() {
        const output = state.outputs.find((item) => item.stage.id === state.activeId);
        if (!output) return;
        welcome.hidden = true;
        viewer.hidden = false;
        document.getElementById("activeTitle").textContent = output.stage.file;
        document.getElementById("activeMeta").textContent = `${output.stage.number} / ${output.stage.label} · ${formatBytes(output.file.size)}`;
        expandAll.disabled = Boolean(output.error);
        collapseAll.disabled = Boolean(output.error);
        tree.replaceChildren();

        if (output.error) {
          const box = document.createElement("div");
          box.className = "error-box";
          const message = document.createElement("div");
          message.textContent = `JSON을 읽을 수 없습니다: ${output.error.message}`;
          const raw = document.createElement("pre");
          raw.textContent = output.text;
          box.append(message, raw);
          tree.append(box);
          return;
        }

        tree.append(renderStage(output.data, output.stage));
      }

      async function copyActiveJson() {
        const output = state.outputs.find((item) => item.stage.id === state.activeId);
        if (!output || output.error) return;
        try {
          await navigator.clipboard.writeText(output.text);
        } catch {
          const textarea = document.createElement("textarea");
          textarea.value = output.text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.append(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }
        const button = document.getElementById("copyJson");
        button.textContent = "복사됨";
        window.setTimeout(() => { button.textContent = "JSON 복사"; }, 1200);
      }

      function renderStage(data, stage) {
        const page = el("div", `stage-page stage-${stage.id}`);
        renderStageIntro(data, stage).forEach((part) => page.append(part));
        getStageRenderer(stage.id)(data, page);
        page.append(renderRawData(data));
        return page;
      }
    })();
