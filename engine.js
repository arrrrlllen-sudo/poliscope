/* Educational scenario engine. Percentages use percentage-point units.
 * All coefficients are illustrative and all cases start from the same state.
 */
(function () {
  "use strict";

  const paramLabels = {
    domestic: "内需传导系数",
    external: "外需敏感系数",
    delivery: "项目兑现系数",
    transfer: "转移支付传导系数",
    enactment: "当年落实比例"
  };

  // A transmission coefficient of 1.00 represents the reference response.
  // Enactment describes timing only; the remaining share is delivered next year.
  const params = {
    us: { domestic: 1.08, external: 0.76, delivery: 0.94, transfer: 0.94, enactment: 0.72 },
    de: { domestic: 0.98, external: 1.18, delivery: 1.02, transfer: 1.07, enactment: 0.75 },
    se: { domestic: 0.96, external: 1.16, delivery: 1.06, transfer: 1.14, enactment: 0.84 },
    jp: { domestic: 1.02, external: 1.04, delivery: 1.10, transfer: 1.00, enactment: 0.81 },
    fr: { domestic: 1.04, external: 0.94, delivery: 1.04, transfer: 1.10, enactment: 0.82 },
    cn: { domestic: 1.13, external: 1.02, delivery: 1.14, transfer: 0.92, enactment: 0.87 },
    in: { domestic: 1.06, external: 0.82, delivery: 0.90, transfer: 0.90, enactment: 0.73 },
    sg: { domestic: 0.82, external: 1.32, delivery: 1.12, transfer: 0.99, enactment: 0.90 },
    br: { domestic: 1.05, external: 0.98, delivery: 0.92, transfer: 1.06, enactment: 0.70 },
    sa: { domestic: 0.93, external: 1.26, delivery: 1.04, transfer: 1.02, enactment: 0.85 }
  };

  const policies = {
    neutral: {
      name: "维持现状", desc: "保留既有安排，观察前期政策和外部需求的影响。",
      now: "今年不新增承诺，先前已安排的支出和改革继续落实。",
      later: "先前项目、培训和治理改革的滞后影响逐渐消退。"
    },
    investment: {
      name: "公共投资", desc: "增加基础设施支出，权衡当期需求、债务和后续产能。",
      now: "项目开支推高需求与借款，增加就业，也可能带动物价上涨。",
      later: "项目投产后支持增长，新增供给缓解部分价格压力。"
    },
    welfare: {
      name: "社会保障", desc: "扩大转移支付，支持居民消费和生活保障。",
      now: "居民可支配收入和消费上升，保障覆盖改善带动公众信任，财政支出增加。",
      later: "若不续行，额外收入支持逐步退出，已经积累的债务仍会结转。"
    },
    tax: {
      name: "减税激励", desc: "降低当年税负，以财政收入换取企业与居民需求。",
      now: "减税支持消费和投资，同时拉大初级财政缺口。",
      later: "私人投资在下一年起形成少量新增产能，需求刺激逐渐减弱。"
    },
    transparency: {
      name: "透明采购", desc: "公开采购过程并加强监督，观察制度调整的时滞。",
      now: "程序公开提升公共问责，流程切换暂时拖慢采购并增加行政成本。",
      later: "项目监督逐步改善问责和信任，采购节约部分财政开支。"
    },
    skills: {
      name: "职业培训", desc: "资助培训和转岗，让技能积累逐步传导至就业与产出。",
      now: "培训开支增加财政需求，参与培训和岗位匹配需要时间。",
      later: "技能积累提高产能、改善岗位匹配，降低失业压力。"
    },
    consultation: {
      name: "公众协商", desc: "邀请公众就政策方案提出意见，并公开政府回应。",
      now: "组织协商会增加行政支出、稍缓项目推进，意见表达渠道改善信任和问责。",
      later: "已收集的意见进入后续回应程序，继续影响公众信任和公共问责。"
    }
  };

  // One unit of intensity. Demand and capacity affect growth in percentage
  // points; deficit is an annual primary deficit in percent of GDP.
  // Governance values are changes on model-specific zero-to-one-hundred scales.
  const effects = {
    neutral: {},
    investment: { demand: 0.44, deficit: 1.22, capacity: 0.22, matching: 0.02 },
    welfare: { demand: 0.29, deficit: 0.95, trust: 0.80 },
    tax: { demand: 0.35, deficit: 1.09, capacity: 0.07 },
    transparency: { demand: -0.11, deficit: 0.16, oversight: 0.74, accountability: 0.95 },
    skills: { demand: 0.09, deficit: 0.65, capacity: 0.26, matching: 0.13 },
    consultation: { demand: -0.07, deficit: 0.13, feedback: 0.60, trust: 0.57, accountability: 0.45 }
  };
  const emptyCommitment = {
    demand: 0, deficit: 0, capacity: 0, matching: 0, oversight: 0, feedback: 0,
    trust: 0, accountability: 0
  };

  // These scenario paths persist only while the corresponding environment
  // is selected. There is no hidden random draw.
  const demandShocks = { base: 0, strong: 0.52, weak: -0.52 };
  const base = { g: 2.4, p: 2, u: 5, d: 55, t: 60, a: 60 };
  const interestRate = 3.0;
  const grossNominalGrowth = (growth, inflation) =>
    (1 + growth / 100) * (1 + inflation / 100);
  const baselineDeficit = base.d * (1 - (1 + interestRate / 100) /
    grossNominalGrowth(base.g, base.p));
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

  function initial() {
    return {
      ...base, gdp: 100, cpi: 100,
      capacity: 0, matching: 0, oversight: 0, feedback: 0,
      pending: { ...emptyCommitment }, year: 0
    };
  }

  function step(state, modelId, policyId = "neutral", intensity = 1, environment = "base") {
    const model = params[modelId];
    const effect = effects[policyId];
    if (!Object.prototype.hasOwnProperty.call(params, modelId) ||
        !Object.prototype.hasOwnProperty.call(effects, policyId) ||
        !Object.prototype.hasOwnProperty.call(demandShocks, environment)) {
      throw new RangeError("未知的制度、政策或外部环境。");
    }
    const strength = Number(intensity);
    if (!Number.isInteger(strength) || strength < 1 || strength > 3) {
      throw new RangeError("政策强度须为 1 至 3 的整数。");
    }
    const transfer = policyId === "welfare" ? model.transfer : 1;
    const commitment = { ...emptyCommitment, ...effect };
    commitment.demand *= model.domestic * transfer;
    commitment.trust *= transfer;
    const realized = {};
    const pending = {};
    for (const [channel, unit] of Object.entries(commitment)) {
      const amount = unit * strength;
      realized[channel] = (state.pending?.[channel] ?? 0) + amount * model.enactment;
      pending[channel] = amount * (1 - model.enactment);
    }
    const demand = realized.demand + demandShocks[environment] * model.external;

    // Unfinished projects from preceding turns deliver supply and labour
    // matching benefits this year. Newly implemented projects mature next year.
    const supply = state.capacity * model.delivery;
    const matchingBenefit = state.matching * model.delivery;
    const supervision = state.oversight * model.delivery;
    const publicFeedback = (state.feedback ?? 0) * model.delivery;
    const g = base.g + 0.30 * (state.g - base.g) + demand + supply;
    const p = base.p + 0.50 * (state.p - base.p) + 0.29 * demand - 0.16 * supply;
    const u = clamp(base.u + 0.64 * (state.u - base.u) -
      0.30 * (g - base.g) - matchingBenefit, 0, 100);

    // Debt is measured relative to current nominal GDP. The baseline primary
    // deficit holds the reference debt ratio constant under neutral conditions.
    const d = Math.max(0, state.d * (1 + interestRate / 100) /
      grossNominalGrowth(g, p) + baselineDeficit + realized.deficit - 0.18 * supervision);

    // Political outcomes describe an illustrative response to changed living
    // conditions, programme reach and procurement oversight.
    const t = clamp(base.t + 0.90 * (state.t - base.t) +
      realized.trust + 0.52 * supervision + 0.68 * publicFeedback -
      0.44 * (u - base.u) - 0.32 * Math.abs(p - base.p), 0, 100);
    const a = clamp(base.a + 0.94 * (state.a - base.a) +
      realized.accountability + 0.68 * supervision + 0.36 * publicFeedback, 0, 100);

    return {
      g, p, u, d, t, a,
      gdp: state.gdp * (1 + g / 100),
      cpi: state.cpi * (1 + p / 100),
      capacity: state.capacity * 0.54 + realized.capacity,
      matching: state.matching * 0.54 + realized.matching,
      oversight: state.oversight * 0.52 + realized.oversight,
      feedback: (state.feedback ?? 0) * 0.52 + realized.feedback,
      pending,
      year: state.year + 1
    };
  }

  const Sim = { initial, step, policies, params, paramLabels };
  if (typeof window !== "undefined") window.Sim = Sim;
  if (typeof module !== "undefined" && module.exports) module.exports = Sim;
})();
