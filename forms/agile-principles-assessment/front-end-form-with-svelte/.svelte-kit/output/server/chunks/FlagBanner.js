import { h as derived, b as attr_class, d as stringify, e as escape_html, c as ensure_array_like } from "./root.js";
const PRINCIPLES = [
  {
    number: 1,
    slug: "customer-satisfaction",
    shortTitle: "Customer satisfaction",
    prompt: "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.",
    description: "We measure success by customer outcomes, not by milestones met. Working software reaches real users early and often, and feedback shapes the next iteration."
  },
  {
    number: 2,
    slug: "welcome-change",
    shortTitle: "Welcome change",
    prompt: "Changing requirements are welcomed, even late in development, to harness competitive advantage.",
    description: "New information is treated as a gift, not a threat. The team adapts the plan when the world changes; change-control overhead is light."
  },
  {
    number: 3,
    slug: "deliver-frequently",
    shortTitle: "Deliver frequently",
    prompt: "We deliver working software frequently, in short cycles ranging from a couple of weeks to a couple of months, with a preference for the shorter timescale.",
    description: "Releases are routine and low-drama. Cycle time is measured in days or low weeks, not quarters."
  },
  {
    number: 4,
    slug: "collaboration",
    shortTitle: "Daily collaboration",
    prompt: "Business stakeholders and developers work together daily throughout the project.",
    description: "Product, business, and engineering share context and decisions in real time. There is no over-the-wall handover."
  },
  {
    number: 5,
    slug: "motivated-individuals",
    shortTitle: "Motivated individuals",
    prompt: "We build projects around motivated individuals, give them the environment and support they need, and trust them to get the job done.",
    description: "Hiring, environment, tooling, and management style are all set up to attract and keep motivated people, and to remove obstacles instead of adding them."
  },
  {
    number: 6,
    slug: "face-to-face",
    shortTitle: "Face-to-face conversation",
    prompt: "The most efficient and effective method of conveying information within and to a development team is rich, real-time conversation (face-to-face or its synchronous video equivalent).",
    description: "Critical decisions are made in conversation, not in long async threads. Documentation captures decisions; it does not replace them."
  },
  {
    number: 7,
    slug: "working-software",
    shortTitle: "Working software",
    prompt: "Working software is the primary measure of progress.",
    description: "We track shipped, working capability — not story points, hours, or the percentage of a Gantt chart that is green."
  },
  {
    number: 8,
    slug: "sustainable-development",
    shortTitle: "Sustainable development",
    prompt: "Agile processes promote sustainable development. Sponsors, developers, and users should be able to maintain a constant pace indefinitely.",
    description: "We do not rely on heroics, weekends, or crunch. Velocity is what the team can hold next quarter and the quarter after that."
  },
  {
    number: 9,
    slug: "technical-excellence",
    shortTitle: "Technical excellence",
    prompt: "Continuous attention to technical excellence and good design enhances agility.",
    description: 'Refactoring, automated tests, code review, and infrastructure quality are part of the work, not a separate "later" project.'
  },
  {
    number: 10,
    slug: "simplicity",
    shortTitle: "Simplicity",
    prompt: "Simplicity — the art of maximising the amount of work not done — is essential.",
    description: "We pull only what we are certain we need. Scope is actively trimmed; we do not gold-plate, over-engineer, or build for hypothetical futures."
  },
  {
    number: 11,
    slug: "self-organising-teams",
    shortTitle: "Self-organising teams",
    prompt: "The best architectures, requirements, and designs emerge from self-organising teams.",
    description: "Teams choose how to deliver outcomes. Architecture decisions sit with the people closest to the work; managers set context and remove blockers."
  },
  {
    number: 12,
    slug: "regular-reflection",
    shortTitle: "Regular reflection",
    prompt: "At regular intervals the team reflects on how to become more effective, then tunes and adjusts its behaviour accordingly.",
    description: "Retrospectives happen on a schedule, produce concrete experiments, and the team verifies whether each experiment worked."
  }
];
const TOTAL_PRINCIPLES = PRINCIPLES.length;
function emptyResponse() {
  return { score: null, comment: "", weight: 1 };
}
function createEmptyAssessment() {
  return {
    respondent: {
      isAnonymous: false,
      fullName: "",
      email: "",
      role: "",
      teamName: "",
      organisationName: "",
      yearsInAgile: null,
      assessmentDate: "",
      assessmentPeriod: ""
    },
    responses: Array.from({ length: TOTAL_PRINCIPLES }, emptyResponse),
    actionPlan: {
      topAction1: "",
      topAction2: "",
      topAction3: "",
      coachNotes: "",
      signedAt: "",
      overallNotes: ""
    }
  };
}
function bandFor(score) {
  if (score === null) return "unanswered";
  if (score >= 4) return "high";
  if (score === 3) return "mid";
  return "low";
}
const COACHING = {
  "customer-satisfaction": {
    high: "Customer feedback loops are tight; keep tracking outcome metrics, not output.",
    mid: "Customer-feedback loops exist but are inconsistent. Define a cadence for user research and outcome metrics.",
    low: "Customer is at arm's length. Establish a recurring feedback loop with real users this quarter."
  },
  "welcome-change": {
    high: "Change is treated as an opportunity; preserve light-weight change-control overhead.",
    mid: "Change is tolerated but slow. Audit hand-offs and approval gates that delay re-prioritisation.",
    low: "Change is treated as a threat. Replace heavy change-control with a lightweight backlog re-ordering ritual."
  },
  "deliver-frequently": {
    high: "Releases are routine and low-drama. Continue to shrink batch size where possible.",
    mid: "Delivery cadence is uneven. Set a target cycle time and identify the largest batch-size constraint.",
    low: "Delivery is rare or unpredictable. Reduce batch size and remove release ceremonies that add no value."
  },
  "collaboration": {
    high: "Daily collaboration is healthy; safeguard the rituals that keep stakeholders close to the work.",
    mid: "Stakeholder collaboration is intermittent. Schedule a recurring product-engineering sync.",
    low: "Stakeholders and engineers are working in silos. Co-locate decisions or create a daily 15-minute joint stand-up."
  },
  "motivated-individuals": {
    high: "People feel trusted and supported. Continue investing in autonomy and tools.",
    mid: "Motivation is mixed. Run a 1:1 listening tour to surface friction.",
    low: "Morale is low or trust is thin. Address environment, tooling, or management style before adding more process."
  },
  "face-to-face": {
    high: "Real-time conversation is the default for important decisions; document outcomes, not deliberations.",
    mid: "Conversation happens but key decisions still drift in async threads. Define which decisions must be live.",
    low: "Important decisions are stuck in chat or email. Establish a synchronous decision ritual."
  },
  "working-software": {
    high: "Progress is measured by shipped, working capability. Continue.",
    mid: "Progress is partly tracked by output proxies. Replace velocity / hours dashboards with shipped-feature counts.",
    low: "Progress is reported by activity, not by working software. Make working software the headline metric."
  },
  "sustainable-development": {
    high: "Pace is sustainable. Watch for early signs of crunch creeping in.",
    mid: "Pace is variable; crunch is creeping in. Capacity-plan with explicit slack.",
    low: "Crunch and heroics are routine. Reset capacity and protect non-overtime delivery before scope."
  },
  "technical-excellence": {
    high: "Technical health is part of definition-of-done; keep refactoring continuous.",
    mid: "Quality work is squeezed. Carve out explicit capacity for testing and refactoring.",
    low: "Technical debt is accumulating faster than it is being repaid. Treat this as the top organisational risk."
  },
  "simplicity": {
    high: "Scope is actively trimmed; resist gold-plating.",
    mid: 'Scope creeps in. Add a written "what we are NOT doing" list to every initiative.',
    low: "Over-engineering or scope creep is the norm. Make trimming a non-optional part of planning."
  },
  "self-organising-teams": {
    high: "Teams choose how to deliver. Reinforce psychological safety to keep emergence working.",
    mid: "Self-organisation is partial. Audit which decisions managers still own that the team could.",
    low: "Command-and-control culture. Push architecture and design decisions back to the team and provide context, not directives."
  },
  "regular-reflection": {
    high: "Retrospectives drive concrete experiments. Continue closing the loop on each.",
    mid: "Retrospectives happen but actions slip. Track each retro action like a top-priority story.",
    low: "Retrospectives are skipped or theatrical. Reinstate them on a fixed schedule with one written follow-up."
  }
};
function applyMaturityRules(data) {
  const perPrincipleBands = [];
  const firedRules = [];
  for (const principle of PRINCIPLES) {
    const idx = principle.number - 1;
    const score = data.responses[idx]?.score ?? null;
    const band = bandFor(score);
    perPrincipleBands.push(band);
    if (band === "unanswered") {
      firedRules.push({
        ruleId: `R-P${pad2$1(principle.number)}-UNANSWERED`,
        principleNumber: principle.number,
        principleSlug: principle.slug,
        band,
        description: `Principle ${principle.number} (${principle.shortTitle}) was not answered.`
      });
      continue;
    }
    const coaching = COACHING[principle.slug];
    const description = coaching ? coaching[band] : "";
    firedRules.push({
      ruleId: `R-P${pad2$1(principle.number)}-${band.toUpperCase()}`,
      principleNumber: principle.number,
      principleSlug: principle.slug,
      band,
      description
    });
  }
  return { perPrincipleBands, firedRules };
}
function pad2$1(n) {
  return n.toString().padStart(2, "0");
}
const PRINCIPLE_FLAGS = {
  "customer-satisfaction": {
    category: "customer-disconnect",
    priority: "high",
    description: "The team is at risk of building features that customers do not value.",
    suggestedAction: "Stand up a real customer-feedback loop within the next two weeks (interviews, beta cohort, or analytics)."
  },
  "welcome-change": {
    category: "change-resistance",
    priority: "high",
    description: "Change is treated as a threat; competitive responsiveness will suffer.",
    suggestedAction: "Replace heavy change-control with a lightweight backlog re-prioritisation ritual."
  },
  "deliver-frequently": {
    category: "slow-delivery",
    priority: "medium",
    description: "Long delivery cycles delay learning and increase batch risk.",
    suggestedAction: "Pick one initiative and ship a thin slice within two weeks; measure cycle time."
  },
  "collaboration": {
    category: "silo-collaboration",
    priority: "high",
    description: "Engineering and business are operating in silos.",
    suggestedAction: "Schedule a daily 15-minute product-engineering sync and rotate attendees."
  },
  "motivated-individuals": {
    category: "morale-risk",
    priority: "high",
    description: "Trust, environment, or motivation are weak. People will leave or disengage.",
    suggestedAction: "Run a structured 1:1 listening tour; surface and remove the top three friction points."
  },
  "face-to-face": {
    category: "communication-gap",
    priority: "medium",
    description: "Critical decisions are stuck in async threads.",
    suggestedAction: "Define which decision classes require synchronous conversation; capture outcomes (not deliberations) in writing."
  },
  "working-software": {
    category: "output-not-outcome",
    priority: "medium",
    description: "Progress is being judged by activity rather than working software.",
    suggestedAction: "Replace velocity / hours dashboards with a shipped-features dashboard."
  },
  "sustainable-development": {
    category: "burnout-risk",
    priority: "high",
    description: "Crunch is the default; burnout and quality regressions are likely.",
    suggestedAction: "Reset capacity to a sustainable baseline and protect non-overtime delivery before adding scope."
  },
  "technical-excellence": {
    category: "technical-debt",
    priority: "high",
    description: "Technical debt is growing faster than it is being repaid; future agility is at risk.",
    suggestedAction: "Allocate explicit weekly capacity to tests, refactoring, and infrastructure quality."
  },
  "simplicity": {
    category: "over-engineering",
    priority: "medium",
    description: "Scope creep or over-engineering is the norm; the team is doing more work than is required.",
    suggestedAction: 'Add a written "what we are NOT doing" list to every initiative; review weekly.'
  },
  "self-organising-teams": {
    category: "command-and-control",
    priority: "high",
    description: "Decision-making sits with managers, not with the team closest to the work.",
    suggestedAction: "Push design and architecture decisions back to the team; managers provide context, not directives."
  },
  "regular-reflection": {
    category: "no-retrospective",
    priority: "high",
    description: "Retrospectives are skipped or theatrical; the team cannot improve itself.",
    suggestedAction: "Reinstate retrospectives on a fixed cadence; track each follow-up like a top-priority story."
  }
};
function detectAdditionalFlags(data) {
  const flags = [];
  let answeredCount = 0;
  for (const principle of PRINCIPLES) {
    const idx = principle.number - 1;
    const score = data.responses[idx]?.score ?? null;
    if (score === null) continue;
    answeredCount += 1;
    if (score <= 2) {
      const spec = PRINCIPLE_FLAGS[principle.slug];
      if (spec) {
        flags.push({
          flagId: `F-${spec.category.toUpperCase()}`,
          category: spec.category,
          priority: spec.priority,
          principleNumber: principle.number,
          description: spec.description,
          suggestedAction: spec.suggestedAction
        });
      }
    }
    if (score === 1) {
      flags.push({
        flagId: `F-CRITICAL-P${pad2(principle.number)}`,
        category: "critical-principle-gap",
        priority: "high",
        principleNumber: principle.number,
        description: `Principle ${principle.number} (${principle.shortTitle}) scored the minimum (1).`,
        suggestedAction: "Treat this principle as a top-priority coaching focus this cycle."
      });
    }
  }
  if (answeredCount < 6) {
    flags.push({
      flagId: "F-INSUFFICIENT-DATA",
      category: "insufficient-data",
      priority: "medium",
      principleNumber: null,
      description: "Fewer than six principles received a score; the composite maturity is not reportable.",
      suggestedAction: "Complete the remaining principles before relying on the maturity result."
    });
  }
  return flags;
}
function pad2(n) {
  return n.toString().padStart(2, "0");
}
const MIN_ANSWERED_FOR_REPORT = 6;
const DEFAULT_WEIGHT = 1;
const WEIGHT_TOLERANCE = 1e-6;
function deriveMaturity(meanScore) {
  if (meanScore === null) return "insufficient-data";
  if (meanScore >= 4.5) return "optimising";
  if (meanScore >= 3.75) return "mature";
  if (meanScore >= 3) return "developing";
  if (meanScore >= 2) return "initial";
  return "ad-hoc";
}
function clampWeight(w) {
  if (w === null || w === void 0 || Number.isNaN(w)) return DEFAULT_WEIGHT;
  if (w <= 0) return DEFAULT_WEIGHT;
  if (w < 0.5) return 0.5;
  if (w > 2) return 2;
  return w;
}
function calculateMaturity(data) {
  let sum = 0;
  let weightedSum = 0;
  let weightSum = 0;
  let answeredCount = 0;
  let weightsCustomised = false;
  for (const r of data.responses) {
    const w = clampWeight(r.weight);
    if (Math.abs(w - DEFAULT_WEIGHT) > WEIGHT_TOLERANCE) weightsCustomised = true;
    if (r.score !== null) {
      sum += r.score;
      weightedSum += r.score * w;
      weightSum += w;
      answeredCount += 1;
    }
  }
  const enoughAnswers = answeredCount >= MIN_ANSWERED_FOR_REPORT;
  const meanScore = enoughAnswers ? round2(sum / answeredCount) : null;
  const weightedMeanScore = enoughAnswers && weightSum > 0 ? round2(weightedSum / weightSum) : null;
  const maturity = deriveMaturity(weightedMeanScore);
  const { perPrincipleBands, firedRules } = applyMaturityRules(data);
  const additionalFlags = detectAdditionalFlags(data);
  return {
    answeredCount,
    meanScore,
    weightedMeanScore,
    weightsCustomised,
    maturity,
    perPrincipleBands,
    firedRules,
    additionalFlags
  };
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
const STEPS = [
  { number: 1, slug: "respondent", title: "Respondent identification", short: "You" },
  { number: 2, slug: "customer-satisfaction", title: "Principle 1 — Customer satisfaction", short: "P1 Customer" },
  { number: 3, slug: "welcome-change", title: "Principle 2 — Welcome change", short: "P2 Change" },
  { number: 4, slug: "deliver-frequently", title: "Principle 3 — Deliver frequently", short: "P3 Deliver" },
  { number: 5, slug: "collaboration", title: "Principle 4 — Daily collaboration", short: "P4 Collab" },
  { number: 6, slug: "motivated-individuals", title: "Principle 5 — Motivated individuals", short: "P5 People" },
  { number: 7, slug: "face-to-face", title: "Principle 6 — Face-to-face conversation", short: "P6 Conv" },
  { number: 8, slug: "working-software", title: "Principle 7 — Working software", short: "P7 Software" },
  { number: 9, slug: "sustainable-development", title: "Principle 8 — Sustainable development", short: "P8 Pace" },
  { number: 10, slug: "technical-excellence", title: "Principle 9 — Technical excellence", short: "P9 Quality" },
  { number: 11, slug: "simplicity", title: "Principle 10 — Simplicity", short: "P10 Simple" },
  { number: 12, slug: "self-organising-teams", title: "Principle 11 — Self-organising teams", short: "P11 Self-org" },
  { number: 13, slug: "regular-reflection", title: "Principle 12 — Regular reflection", short: "P12 Reflect" },
  { number: 14, slug: "summary", title: "Summary, maturity & action plan", short: "Summary" }
];
const TOTAL_STEPS = STEPS.length;
class AssessmentStore {
  data = createEmptyAssessment();
  currentStep = 1;
  #result = derived(() => calculateMaturity(this.data));
  get result() {
    return this.#result();
  }
  set result($$value) {
    return this.#result($$value);
  }
  reset() {
    this.data = createEmptyAssessment();
    this.currentStep = 1;
  }
  goto(n) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }
}
const store = new AssessmentStore();
function FlagBanner($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { flags, maturity } = $$props;
    const banner = derived(() => {
      switch (maturity) {
        case "optimising":
          return {
            class: "bg-emerald-100 border-emerald-600 text-emerald-900",
            label: "OPTIMISING"
          };
        case "mature":
          return {
            class: "bg-green-100 border-green-600 text-green-900",
            label: "MATURE"
          };
        case "developing":
          return {
            class: "bg-yellow-100 border-yellow-600 text-yellow-900",
            label: "DEVELOPING"
          };
        case "initial":
          return {
            class: "bg-orange-100 border-orange-600 text-orange-900",
            label: "INITIAL"
          };
        case "ad-hoc":
          return {
            class: "bg-red-100 border-red-600 text-red-900",
            label: "AD-HOC"
          };
        default:
          return {
            class: "bg-slate-100 border-slate-500 text-slate-800",
            label: "INSUFFICIENT DATA"
          };
      }
    });
    $$renderer2.push(`<div${attr_class(`border-l-4 ${stringify(banner().class)} p-4 my-4 rounded`)}><p class="font-semibold mb-2">Composite maturity: ${escape_html(banner().label)}</p> `);
    if (flags.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm mb-1">Operational flags:</p> <ul class="list-disc list-inside text-sm space-y-1"><!--[-->`);
      const each_array = ensure_array_like(flags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let f = each_array[$$index];
        $$renderer2.push(`<li><span class="font-medium">[${escape_html(f.priority.toUpperCase())}]</span> ${escape_html(f.description)} <span class="text-slate-700">— ${escape_html(f.suggestedAction)}</span></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="text-sm">No operational flags raised.</p>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  FlagBanner as F,
  PRINCIPLES as P,
  STEPS as S,
  store as s
};
