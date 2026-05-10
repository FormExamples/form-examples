import { a as attr, b as attr_class, e as escape_html, c as ensure_array_like, d as stringify, f as bind_props, h as derived, i as attr_style } from "../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { s as store, P as PRINCIPLES, F as FlagBanner, S as STEPS } from "../../chunks/FlagBanner.js";
import "clsx";
function Step01Respondent($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<section><h2 class="text-xl font-semibold mb-3">Step 1 — Respondent identification</h2> <p class="text-sm text-slate-600 mb-4">Tell us who is completing this assessment and which team or organisation
    you are scoring. None of these fields affect the maturity calculation.</p> <label class="flex items-start gap-3 mb-4 p-3 border border-slate-300 rounded bg-slate-50 cursor-pointer"><input type="checkbox" class="mt-1"${attr("checked", store.data.respondent.isAnonymous, true)}/> <span class="text-sm"><span class="font-medium">Submit anonymously.</span> <span class="text-slate-600">When checked, name, email, and role are cleared and excluded from the
        report. Team and organisation context are still recorded so coaching
        aggregates can group the response.</span></span></label> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><label${attr_class("block", void 0, { "opacity-50": store.data.respondent.isAnonymous })}><span class="text-sm text-slate-700">Full name</span> <input type="text" class="w-full border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100"${attr("disabled", store.data.respondent.isAnonymous, true)}${attr("value", store.data.respondent.fullName)}/></label> <label${attr_class("block", void 0, { "opacity-50": store.data.respondent.isAnonymous })}><span class="text-sm text-slate-700">Email</span> <input type="email" class="w-full border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100"${attr("disabled", store.data.respondent.isAnonymous, true)}${attr("value", store.data.respondent.email)}/></label> <label${attr_class("block", void 0, { "opacity-50": store.data.respondent.isAnonymous })}><span class="text-sm text-slate-700">Role</span> `);
    $$renderer2.select(
      {
        class: "w-full border border-slate-300 rounded px-2 py-1 disabled:bg-slate-100",
        disabled: store.data.respondent.isAnonymous,
        value: store.data.respondent.role
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`—`);
        });
        $$renderer3.option({ value: "individual-contributor" }, ($$renderer4) => {
          $$renderer4.push(`Individual contributor`);
        });
        $$renderer3.option({ value: "team-lead" }, ($$renderer4) => {
          $$renderer4.push(`Team lead`);
        });
        $$renderer3.option({ value: "scrum-master" }, ($$renderer4) => {
          $$renderer4.push(`Scrum master`);
        });
        $$renderer3.option({ value: "product-owner" }, ($$renderer4) => {
          $$renderer4.push(`Product owner`);
        });
        $$renderer3.option({ value: "engineering-manager" }, ($$renderer4) => {
          $$renderer4.push(`Engineering manager`);
        });
        $$renderer3.option({ value: "agile-coach" }, ($$renderer4) => {
          $$renderer4.push(`Agile coach`);
        });
        $$renderer3.option({ value: "executive-sponsor" }, ($$renderer4) => {
          $$renderer4.push(`Executive sponsor`);
        });
        $$renderer3.option({ value: "other" }, ($$renderer4) => {
          $$renderer4.push(`Other`);
        });
      }
    );
    $$renderer2.push(`</label> <label class="block"><span class="text-sm text-slate-700">Years working in agile environments</span> <input type="number" min="0" max="50" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.respondent.yearsInAgile)}/></label> <label class="block"><span class="text-sm text-slate-700">Team being assessed</span> <input type="text" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.respondent.teamName)}/></label> <label class="block"><span class="text-sm text-slate-700">Organisation / programme</span> <input type="text" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.respondent.organisationName)}/></label> <label class="block"><span class="text-sm text-slate-700">Assessment date</span> <input type="date" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.respondent.assessmentDate)}/></label> <label class="block"><span class="text-sm text-slate-700">Assessment cadence</span> `);
    $$renderer2.select(
      {
        class: "w-full border border-slate-300 rounded px-2 py-1",
        value: store.data.respondent.assessmentPeriod
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`—`);
        });
        $$renderer3.option({ value: "sprint" }, ($$renderer4) => {
          $$renderer4.push(`Per sprint`);
        });
        $$renderer3.option({ value: "quarter" }, ($$renderer4) => {
          $$renderer4.push(`Quarterly`);
        });
        $$renderer3.option({ value: "half-year" }, ($$renderer4) => {
          $$renderer4.push(`Half-yearly`);
        });
        $$renderer3.option({ value: "annual" }, ($$renderer4) => {
          $$renderer4.push(`Annual`);
        });
        $$renderer3.option({ value: "ad-hoc" }, ($$renderer4) => {
          $$renderer4.push(`Ad-hoc`);
        });
      }
    );
    $$renderer2.push(`</label></div></section>`);
  });
}
function LikertScale($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { name, value = void 0 } = $$props;
    const OPTIONS = [
      { score: 1, label: "Strongly disagree" },
      { score: 2, label: "Disagree" },
      { score: 3, label: "Neutral / partial" },
      { score: 4, label: "Agree" },
      { score: 5, label: "Strongly agree" }
    ];
    function classFor(s) {
      if (value !== s) return "bg-white border-slate-300 text-slate-700 hover:bg-brand-50";
      if (s <= 2) return "bg-red-100 border-red-500 text-red-900";
      if (s === 3) return "bg-yellow-100 border-yellow-500 text-yellow-900";
      return "bg-green-100 border-green-500 text-green-900";
    }
    $$renderer2.push(`<fieldset class="border-0 p-0 m-0"><legend class="sr-only">${escape_html(name)}</legend> <div class="grid grid-cols-1 sm:grid-cols-5 gap-2" role="radiogroup"><!--[-->`);
    const each_array = ensure_array_like(OPTIONS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let opt = each_array[$$index];
      $$renderer2.push(`<button type="button" role="radio"${attr("aria-checked", value === opt.score)}${attr_class(`border rounded px-3 py-2 text-sm text-left transition-colors ${stringify(classFor(opt.score))}`)}><span class="block font-semibold">${escape_html(opt.score)}</span> <span class="block text-xs">${escape_html(opt.label)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div> <p class="text-xs text-slate-500 mt-1">Click a score to select. Click the same score again to clear.</p></fieldset>`);
    bind_props($$props, { value });
  });
}
function PrincipleStep($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { principleNumber } = $$props;
    const principle = derived(() => PRINCIPLES.find((p) => p.number === principleNumber) ?? PRINCIPLES[0]);
    const idx = derived(() => principleNumber - 1);
    const stepIndex = derived(() => principleNumber + 1);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-1">Step ${escape_html(stepIndex())} — Principle ${escape_html(principleNumber)}: ${escape_html(principle().shortTitle)}</h2> <p class="text-slate-700 mb-3"><em>${escape_html(principle().prompt)}</em></p> <p class="text-sm text-slate-600 mb-4">${escape_html(principle().description)}</p> <fieldset class="mb-4"><legend class="block text-sm font-medium text-slate-700 mb-2">How well does this describe your team / organisation today?</legend> `);
      LikertScale($$renderer3, {
        name: `principle-${stringify(principleNumber)}`,
        get value() {
          return store.data.responses[idx()].score;
        },
        set value($$value) {
          store.data.responses[idx()].score = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></fieldset> <label class="block"><span class="block text-sm font-medium text-slate-700 mb-1">Comment (optional)</span> <textarea rows="3" class="w-full border border-slate-300 rounded px-2 py-1 text-sm" placeholder="Concrete examples, blockers, or evidence — these populate the action plan.">`);
      const $$body = escape_html(store.data.responses[idx()].comment);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea></label></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step02CustomerSatisfaction($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 1 });
}
function Step03WelcomeChange($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 2 });
}
function Step04DeliverFrequently($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 3 });
}
function Step05Collaboration($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 4 });
}
function Step06MotivatedIndividuals($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 5 });
}
function Step07FaceToFace($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 6 });
}
function Step08WorkingSoftware($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 7 });
}
function Step09SustainableDevelopment($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 8 });
}
function Step10TechnicalExcellence($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 9 });
}
function Step11Simplicity($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 10 });
}
function Step12SelfOrganisingTeams($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 11 });
}
function Step13RegularReflection($$renderer) {
  PrincipleStep($$renderer, { principleNumber: 12 });
}
function Step14Summary($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const r = derived(() => store.result);
    function bandClass(b) {
      if (b === "high") return "text-emerald-700";
      if (b === "mid") return "text-yellow-700";
      if (b === "low") return "text-red-700";
      return "text-slate-400";
    }
    function bandLabel(b) {
      if (b === "unanswered") return "—";
      return b.toUpperCase();
    }
    $$renderer2.push(`<section><h2 class="text-xl font-semibold mb-4">Step 14 — Summary, maturity &amp; action plan</h2> <div class="bg-slate-100 p-4 rounded mb-4"><p><strong>Principles answered:</strong> ${escape_html(r().answeredCount)} / 12</p> <p><strong>Unweighted mean:</strong> ${escape_html(r().meanScore !== null ? r().meanScore.toFixed(2) : "— (insufficient data)")}</p> `);
    if (r().weightsCustomised) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p><strong>Weighted mean:</strong> ${escape_html(r().weightedMeanScore !== null ? r().weightedMeanScore.toFixed(2) : "— (insufficient data)")}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p><strong>Composite maturity:</strong> ${escape_html(r().maturity.toUpperCase())}${escape_html(r().weightsCustomised ? " (weighted)" : "")}</p></div> `);
    FlagBanner($$renderer2, { flags: r().additionalFlags, maturity: r().maturity });
    $$renderer2.push(`<!----> <div class="bg-white border border-slate-200 rounded p-4 mb-4"><h3 class="font-semibold mb-2">Per-principle bands</h3> <ul class="text-sm space-y-1"><!--[-->`);
    const each_array = ensure_array_like(PRINCIPLES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      const band = r().perPrincipleBands[p.number - 1];
      const score = store.data.responses[p.number - 1].score;
      $$renderer2.push(`<li class="flex justify-between gap-4"><span>P${escape_html(p.number)} — ${escape_html(p.shortTitle)}</span> <span${attr_class(`${stringify(bandClass(band))} font-medium`)}>${escape_html(score ?? "—")} · ${escape_html(bandLabel(band))}</span></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <details class="mb-4 bg-white border border-slate-200 rounded p-4"><summary class="cursor-pointer text-sm font-medium">Customise weights `);
    if (r().weightsCustomised) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-xs text-brand-700">(active)</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></summary> <p class="text-xs text-slate-600 mt-2">Weight each principle between <strong>0.5</strong> (half-weight) and <strong>2.0</strong> (double-weight). Default is <strong>1.0</strong>.
      Weights only affect the weighted mean and the composite maturity; the
      unweighted mean remains visible above.</p> <ul class="mt-3 space-y-2 text-sm"><!--[-->`);
    const each_array_1 = ensure_array_like(PRINCIPLES);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let p = each_array_1[$$index_1];
      $$renderer2.push(`<li class="flex items-center gap-3"><span class="flex-1">P${escape_html(p.number)} — ${escape_html(p.shortTitle)}</span> <input type="number" min="0.5" max="2.0" step="0.1" class="w-20 border border-slate-300 rounded px-2 py-1 text-right"${attr("value", store.data.responses[p.number - 1].weight)}/></li>`);
    }
    $$renderer2.push(`<!--]--></ul> <button type="button" class="mt-3 px-3 py-1 text-sm border border-slate-300 rounded bg-white hover:bg-slate-100">Reset all weights to 1.0</button></details> `);
    if (r().firedRules.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<details class="mb-4"><summary class="cursor-pointer text-sm font-medium">Fired coaching rules (${escape_html(r().firedRules.length)})</summary> <ul class="list-disc list-inside text-sm mt-2 space-y-1"><!--[-->`);
      const each_array_2 = ensure_array_like(r().firedRules);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let f = each_array_2[$$index_2];
        $$renderer2.push(`<li><code class="text-xs">${escape_html(f.ruleId)}</code> — P${escape_html(f.principleNumber)} ${escape_html(f.band.toUpperCase())}: ${escape_html(f.description || "(no coaching note)")}</li>`);
      }
      $$renderer2.push(`<!--]--></ul></details>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 gap-3 mb-4"><label class="block"><span class="text-sm font-medium text-slate-700">Top action 1</span> <input type="text" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.actionPlan.topAction1)}/></label> <label class="block"><span class="text-sm font-medium text-slate-700">Top action 2</span> <input type="text" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.actionPlan.topAction2)}/></label> <label class="block"><span class="text-sm font-medium text-slate-700">Top action 3</span> <input type="text" class="w-full border border-slate-300 rounded px-2 py-1"${attr("value", store.data.actionPlan.topAction3)}/></label> <label class="block"><span class="text-sm font-medium text-slate-700">Coach notes</span> <textarea rows="3" class="w-full border border-slate-300 rounded px-2 py-1">`);
    const $$body = escape_html(store.data.actionPlan.coachNotes);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></label> <label class="block"><span class="text-sm font-medium text-slate-700">Overall notes</span> <textarea rows="3" class="w-full border border-slate-300 rounded px-2 py-1">`);
    const $$body_1 = escape_html(store.data.actionPlan.overallNotes);
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea></label></div> <p class="text-sm text-slate-600">The maturity result is intended to seed coaching conversations and
    retrospective items. It is a self-report; cross-team aggregation should
    be done before drawing organisation-wide conclusions.</p></section>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const stepComponents = [
      Step01Respondent,
      Step02CustomerSatisfaction,
      Step03WelcomeChange,
      Step04DeliverFrequently,
      Step05Collaboration,
      Step06MotivatedIndividuals,
      Step07FaceToFace,
      Step08WorkingSoftware,
      Step09SustainableDevelopment,
      Step10TechnicalExcellence,
      Step11Simplicity,
      Step12SelfOrganisingTeams,
      Step13RegularReflection,
      Step14Summary
    ];
    const result = derived(() => store.result);
    const progressPct = derived(() => Math.round(result().answeredCount / 12 * 100));
    $$renderer2.push(`<section class="prose max-w-none mb-6"><h2 class="text-xl font-semibold">Self-assessment</h2> <p class="text-slate-700 my-2">Complete all 14 sections below, then generate the report. The tool
    computes a composite agility maturity level, fires coaching rules per
    principle, and surfaces operational flags such as burnout risk,
    technical-debt risk, and command-and-control culture.</p> <div class="bg-white border border-slate-200 rounded p-3 mt-3"><p class="text-sm font-medium text-slate-700 mb-1">Progress: ${escape_html(result().answeredCount)} of 12 principles scored (${escape_html(progressPct())}%)</p> <div class="w-full bg-slate-200 rounded h-2 overflow-hidden"><div class="h-2 bg-brand-600"${attr_style(`width: ${stringify(progressPct())}%`)}></div></div></div></section> <nav class="mb-6 flex flex-wrap gap-1 text-xs" aria-label="Step navigation"><!--[-->`);
    const each_array = ensure_array_like(STEPS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let s = each_array[$$index];
      $$renderer2.push(`<a${attr("href", `#step-${stringify(s.number)}`)} class="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-brand-50">${escape_html(s.number)}. ${escape_html(s.short)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav> <div class="space-y-6"><!--[-->`);
    const each_array_1 = ensure_array_like(stepComponents);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let StepComponent = each_array_1[i];
      $$renderer2.push(`<div${attr("id", `step-${stringify(i + 1)}`)} class="bg-white p-6 rounded-lg shadow-sm scroll-mt-20">`);
      if (StepComponent) {
        $$renderer2.push("<!--[-->");
        StepComponent($$renderer2, {});
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(`</div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-8 pt-4 border-t border-slate-200 flex flex-wrap gap-3 justify-end"><button type="button" class="px-4 py-2 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100">Start over</button> <button type="button" class="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700">Generate report</button></div>`);
  });
}
export {
  _page as default
};
