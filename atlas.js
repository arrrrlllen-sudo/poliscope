(() => {
  "use strict";

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  function button(text, className, action) {
    const node = make("button", className, text);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }

  const iconPaths = {
    landmark: '<path d="m3 9 9-5 9 5M4 10h16M6 11v7m4-7v7m4-7v7m4-7v7M3 20h18"/>',
    layer: '<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    book: '<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v13c-3-1-6-1-9 1-3-2-6-2-9-1V5Zm9 2v11"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    sliders: '<path d="M4 6h6m4 0h6M4 12h11m4 0h1M4 18h2m4 0h10"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
    link: '<path d="M13 5h6v6m0-6-9 9M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"/>',
    check: '<path d="m4 12 5 5L20 6"/>'
  };

  function icon(name) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    el.setAttribute("viewBox", "0 0 24 24");
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "currentColor");
    el.setAttribute("stroke-width", "1.7");
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    el.setAttribute("class", "atlas-icon");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = iconPaths[name] || "";
    return el;
  }

  function head(title, summary) {
    const header = make("header", "atlas-head");
    header.append(make("h1", "", title), make("p", "", summary));
    return header;
  }

  function picture(model, kind, eager = false) {
    const panel = make("div", "atlas-photo " + kind);
    const img = make("img", "atlas-city");
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    img.alt = "";
    img.addEventListener("error", () => img.remove());
    img.src = window.PHOTO_URLS?.[model.id] || "photos/" + model.id + ".webp";
    panel.append(img);
    return panel;
  }

  function external(label, url) {
    let parsed;
    try { parsed = new URL(url); } catch { return make("span", "", label); }
    if (!(parsed.protocol === "https:" || parsed.protocol === "http:")) return make("span", "", label);
    const anchor = make("a", "atlas-source", label);
    anchor.href = parsed.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.append(icon("link"));
    return anchor;
  }

  function fact(title, content, image) {
    const section = make("section", "atlas-fact");
    const label = make("h3", "atlas-fact-label", title);
    label.prepend(icon(image));
    section.append(label, make("p", "", content));
    return section;
  }

  function detail(container, model, current, onChoose, trigger) {
    const dialog = make("dialog", "atlas-dialog");
    dialog.setAttribute("aria-label", model.country + "：" + model.name);
    const header = picture(model, "atlas-dialog-photo", true);
    const heading = make("div", "atlas-photo-title");
    heading.append(make("span", "atlas-overline", model.country), make("h2", "", model.name));
    header.append(heading);
    const close = button("", "atlas-close", () => dialog.close());
    close.setAttribute("aria-label", "关闭制度简介");
    close.append(icon("close"));
    header.append(close);

    const body = make("div", "atlas-detail-body");
    body.append(
      fact("经济安排", model.economy, "layer"),
      fact(model.politics + " · 政治结构", model.governance, "landmark"),
      fact("政策如何传导", model.channel, "sliders")
    );
    const sourceSection = make("section", "atlas-source-list");
    const sourceTitle = make("h3", "atlas-fact-label", "延伸阅读");
    sourceTitle.prepend(icon("book"));
    sourceSection.append(sourceTitle);
    for (const source of model.sources || []) sourceSection.append(external(source.label, source.url));
    if (model.sources?.length) body.append(sourceSection);
    const footer = make("div", "atlas-dialog-foot");
    const primary = button(current ? "返回当前推演" : "选用此模式", "atlas-primary", () => {
      dialog.close();
      onChoose(model.id);
    });
    footer.append(button("关闭", "atlas-quiet", () => dialog.close()), primary);
    dialog.append(header, body, footer);
    dialog.addEventListener("close", () => {
      dialog.remove();
      if (trigger?.isConnected) trigger.focus({preventScroll: true});
    }, {once: true});
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    container.append(dialog);
    dialog.showModal();
    close.focus({preventScroll: true});
  }

  function library(container, activeModelId, onChoose, focusModelId) {
    const root = make("section", "atlas-root");
    root.append(head("制度图谱", "观察十种现实制度组合，了解同一项政策在不同经济安排和治理结构中的传导方式。"));
    const grid = make("div", "atlas-grid");
    let initialCard;
    for (const [index, model] of window.MODELS.entries()) {
      const current = model.id === activeModelId;
      const card = make("article", "atlas-model" + (current ? " atlas-model-current" : ""));
      const cover = picture(model, "atlas-card-photo", index < 3);
      cover.append(make("span", "atlas-country", model.country));
      if (current) {
        const active = make("span", "atlas-current", "当前模式");
        active.prepend(icon("check"));
        cover.append(active);
      }
      const body = make("div", "atlas-card-body");
      const title = make("h2", "", model.name);
      const politics = make("div", "atlas-regime", model.politics);
      politics.prepend(icon("landmark"));
      const info = button("制度简介", "atlas-card-info", () => detail(root, model, current, onChoose, info));
      info.setAttribute("aria-label", "查看" + model.country + "制度简介");
      info.prepend(icon("book"));
      const select = button(current ? "继续推演" : "选用模式", "atlas-card-select", () => onChoose(model.id));
      select.setAttribute("aria-label", (current ? "继续" : "选用") + model.country + "模式推演");
      const actions = make("div", "atlas-actions");
      actions.append(info, select);
      body.append(title, politics, make("p", "atlas-summary", model.economy), actions);
      card.append(cover, body);
      grid.append(card);
      if (model.id === focusModelId) initialCard = {model, current, info};
    }
    root.append(grid);
    container.replaceChildren(root);
    if (initialCard) detail(root, initialCard.model, initialCard.current, onChoose, initialCard.info);
  }

  function textPanel(title, text, symbol) {
    const section = make("section", "atlas-notes-panel");
    const heading = make("h2", "atlas-subhead", title);
    heading.prepend(icon(symbol));
    section.append(heading);
    if (text) section.append(make("p", "", text));
    return section;
  }

  function note(section, label, content) {
    const row = make("div", "atlas-note");
    row.append(make("h3", "", label), make("p", "", content));
    section.append(row);
  }

  function methods(container) {
    const root = make("section", "atlas-root");
    root.append(head("模型说明", "了解模拟器如何把年度政策转换成经济与治理指标，以及这些数值可以回答哪些问题。"));
    const columns = make("div", "atlas-method-columns");
    const primary = make("div", "atlas-method-column");
    const side = make("div", "atlas-method-column");

    const method = textPanel("一个模拟年如何运作", "", "sliders");
    note(method, "选择制度、政策与环境", "每一步推进一个模拟年。预览时，第一年执行所选政策，后续年份维持现状，外需始终保持所选情景。正式推进后可以逐年改选。");
    note(method, "叠加即期和滞后作用", "模型将一项行动的直接作用和财政成本分为当年与次年落实。当年落实比例因情景而异，其余部分次年生效。外需冲击在当年全额计入。投资形成的产能、职业培训的岗位匹配和采购监督还会在之后继续产生影响。");
    note(method, "与维持现状比较", "从同一个年初状态出发，在相同外部需求下分别计算实施所选政策与维持现状的结果。两条路径的差值表示模型归于本次选择的边际影响。历史政策效应会继续传递。");
    primary.append(method);

    const readings = textPanel("如何读图与变化量", "", "layer");
    note(readings, "指数与百分比", "实际产出指数与消费价格指数均以共同起点为 100，按每年的实际增长率和通胀率分别累积。价格指数上升表示总体价格水平上涨。");
    note(readings, "公众信任与公共问责", "公众信任表示模型中的公众对公共机构的信心，公共问责表示行政行为可被监督和解释的程度。两者使用 0–100 示意分。趋势图把公众信任的起始 60 分换算为指数 100。例如，原始得分达到 66 分时，图上读数是 66 ÷ 60 × 100 = 110。");
    note(readings, "区分单位", "增速、通胀、失业率或债务占比从 5% 上升至 6%，变化量是 1 个百分点。信任和问责从 60 上升至 61，变化量是 1 分。");
    primary.append(readings);

    const initialState = window.Sim.initial();
    const starting = textPanel("十种模式的共同起点", "统一初值便于比较同一项政策。", "landmark");
    const baseline = make("dl", "atlas-baseline");
    const fields = [
      ["实际 GDP 增速", "g", "%"], ["通货膨胀率", "p", "%"], ["失业率", "u", "%"],
      ["公共债务占 GDP", "d", "%"], ["公众信任", "t", " / 100"], ["公共问责", "a", " / 100"]
    ];
    for (const [label, key, suffix] of fields) {
      const row = make("div", "");
      row.append(make("dt", "", label), make("dd", "", String(initialState[key]) + suffix));
      baseline.append(row);
    }
    starting.append(baseline);
    side.append(starting);
    const example = textPanel("公共投资如何影响美国情景", "", "sliders");
    const invested = window.Sim.step(initialState, "us", "investment", 2, "base");
    const neutral = window.Sim.step(initialState, "us", "neutral", 2, "base");
    const following = window.Sim.step(invested, "us", "neutral", 2, "base");
    example.append(make("p", "", "从共同起点出发，外需保持基准。第一年采用中等力度的公共投资，实际 GDP 增速为 " +
      invested.g.toFixed(2) + "%，比同年维持现状高 " + (invested.g - neutral.g).toFixed(2) +
      " 个百分点，公共债务占 GDP 比同期对照高 " + (invested.d - neutral.d).toFixed(2) + " 个百分点。"));
    example.append(make("p", "", "第二年改为维持现状，前一年的剩余支出和已形成的产能仍有影响，模拟增速为 " + following.g.toFixed(2) + "%。"));
    side.append(example);
    const limits = textPanel("适用范围", "", "book");
    limits.append(make("p", "", "十种案例是观察制度差异的入口。现实国家通常混合多种制度安排，政策效果还取决于法律授权、执行细节及当时的经济周期。"));
    limits.append(make("p", "", "初值、传导系数与政策效果均为教学假设，未经历史数据估计或预测准确率检验。推演适合比较假设条件下的方向、时滞与权衡，不能据此预测某个国家的实际增速、民意或政权变动。"));
    side.append(limits);
    columns.append(primary, side);
    root.append(columns);

    const equations = make("details", "atlas-expand");
    equations.append(make("summary", "", "查看年度计算规则"));
    const rules = make("div", "atlas-expand-content");
    note(rules, "产出与价格", "模型把当年支出冲击和外需冲击合计为需求项，把以前年度投入形成的产能记为供给项。实际增速等于 2.4% 加上 0.30 倍的上年增速偏离、当期需求项和供给项。通胀等于 2% 加上 0.50 倍的上年通胀偏离、0.29 倍需求项，再减去 0.16 倍供给项。偏离均以共同开局数值为参照。");
    note(rules, "债务与就业", "上年的债务按假设的 3% 名义利率计息，再除以名义 GDP 增长因子，加入本年的初级赤字及政策支出，扣除采购监督带来的节约。就业端由上年的失业率、当年增长偏离和已有培训的岗位匹配效果共同决定。");
    note(rules, "问责与信任", "透明采购逐步提高监督能力，监督效果可以改善问责与信任并节约采购支出。公众协商启动参与程序，当年产生组织成本，并直接影响信任和问责。后续反馈回应继续影响这两项指标。采购监督带来的财政节约仅由透明采购产生。保障覆盖、失业率与通胀偏离也会改变信任分。两项分值均限制在 0 至 100。");
    equations.append(rules);
    root.append(equations);

    const parameterFields = Object.keys(window.Sim.paramLabels || {});
    if (parameterFields.length) {
      const details = make("details", "atlas-expand");
      details.append(make("summary", "", "查看十种模式的传导系数"));
      const block = make("div", "atlas-expand-content");
      block.append(make("p", "", "内需、外需、项目兑现和转移支付系数以 1.00 为参考强度，分别调整政策引起的内需变化、外需冲击、既有项目的后续效应与转移支付的作用。当年落实比例专门描述政策的落实时间，例如 0.80 表示当年落实 80%、次年落实 20%。这些假设未经国别数据估计，不能据其评价治理效率。"));
      const scroll = make("div", "atlas-table-scroll");
      const table = make("table", "atlas-table");
      const thead = make("thead");
      const hrow = make("tr");
      hrow.append(make("th", "", "制度案例"));
      const labels = window.Sim.paramLabels;
      for (const field of parameterFields) hrow.append(make("th", "", labels[field]?.label || labels[field]?.name || labels[field]));
      thead.append(hrow);
      const tbody = make("tbody");
      for (const model of window.MODELS) {
        const row = make("tr");
        const entry = window.Sim.params[model.id];
        const key = make("th", "", model.country);
        key.scope = "row";
        row.append(key);
        for (const field of parameterFields) row.append(make("td", "", typeof entry?.[field] === "number" ? entry[field].toFixed(2) : "—"));
        tbody.append(row);
      }
      table.append(thead, tbody);
      scroll.append(table);
      block.append(scroll);
      details.append(block);
      root.append(details);
    }

    const credits = make("details", "atlas-expand");
    credits.append(make("summary", "", "城市影像来源"));
    const creditList = make("div", "atlas-expand-content atlas-credits");
    credits.append(creditList);
    credits.addEventListener("toggle", async () => {
      if (!credits.open) return;
      try {
        let data = window.PHOTO_CREDITS;
        if (!data) {
          const request = await fetch("photos/credits.json");
          if (!request.ok) throw new Error("Image credits unavailable");
          data = await request.json();
        }
        for (const model of window.MODELS) {
          const item = data[model.id];
          if (!item) continue;
          const line = make("div", "atlas-credit");
          line.append(make("strong", "", model.country), external(item.title || "城市景观", item.url), make("span", "", [item.credit, item.license].filter(Boolean).join(" · ")));
          creditList.append(line);
        }
      } catch {
        creditList.textContent = "此处暂时无法读取城市影像来源。";
      }
    }, {once:true});
    root.append(credits);
    container.replaceChildren(root);
  }

  window.Atlas = Object.freeze({library, methods});
})();
