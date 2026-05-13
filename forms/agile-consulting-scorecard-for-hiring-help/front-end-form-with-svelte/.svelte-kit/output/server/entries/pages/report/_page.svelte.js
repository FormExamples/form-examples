import { h as head, e as escape_html, a1 as attr, a6 as ensure_array_like, a0 as derived } from "../../../chunks/renderer.js";
import { a as assessment } from "../../../chunks/assessment.svelte.js";
import { g as getRecommendedActions } from "../../../chunks/recommendations.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const actions = derived(() => getRecommendedActions(assessment.data));
    let downloading = false;
    head("fc7f3r", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Report — Agile Consulting Scorecard</title>`);
      });
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-4 py-6"><header class="flex items-baseline justify-between gap-3"><h1 class="text-2xl font-bold text-slate-800">Scorecard report</h1> <a href="/" class="text-sm text-blue-600">← Back to wizard</a></header> <section class="bg-white border border-slate-300 rounded p-4 mt-4"><div class="flex items-end gap-4 flex-wrap"><div><div class="text-3xl font-bold">${escape_html(assessment.grade.scoreTotal)}</div> <div class="text-xs text-slate-600">/ 16 total</div></div> <div><div class="text-3xl font-bold">${escape_html(assessment.grade.manifestoSubtotal)}</div> <div class="text-xs text-slate-600">/ 4 manifesto</div></div> <div><div class="text-3xl font-bold">${escape_html(assessment.grade.principlesSubtotal)}</div> <div class="text-xs text-slate-600">/ 12 principles</div></div> <div class="ml-auto"><span class="inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-blue-100 text-blue-900">${escape_html(assessment.grade.computedBand)}</span></div></div></section> <section class="mt-4 flex flex-wrap gap-2"><button type="button" class="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"${attr("disabled", downloading, true)}>${escape_html("Download PDF")}</button> <button type="button" class="px-4 py-2 rounded border border-blue-500 bg-white text-blue-700" title="Redacted JSON suitable to share with prospective consultants">Download pre-tender JSON</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section class="mt-4 bg-white border border-slate-300 rounded p-4"><h2 class="text-lg font-semibold text-slate-800">Readiness flags</h2> `);
    if (assessment.grade.additionalFlags.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-slate-600 mt-2">No flags fired.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<ul class="mt-2 space-y-2"><!--[-->`);
      const each_array = ensure_array_like(assessment.grade.additionalFlags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let flag = each_array[$$index];
        $$renderer2.push(`<li class="rounded border-l-4 border-red-500 bg-red-50 p-2"><div class="font-semibold text-sm">${escape_html(flag.category)} <span class="text-xs text-slate-500">(${escape_html(flag.priority)})</span></div> <div class="text-sm">${escape_html(flag.description)}</div> <div class="text-xs text-slate-600 mt-1"><strong>Suggested action:</strong> ${escape_html(flag.suggestedAction)}</div></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></section> <section class="mt-4 bg-white border border-slate-300 rounded p-4"><h2 class="text-lg font-semibold text-slate-800">Recommended next actions</h2> `);
    if (actions().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-slate-600 mt-2">No items marked "No" — no specific interventions recommended.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="text-sm text-slate-600 mt-2">One per item the respondent marked "No". Work through these before
				(or alongside) any agile-consulting engagement.</p> <ol class="mt-3 space-y-3 list-decimal pl-5"><!--[-->`);
      const each_array_1 = ensure_array_like(actions());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let action = each_array_1[$$index_1];
        $$renderer2.push(`<li><div class="font-semibold text-sm">${escape_html(action.heading)}</div> <div class="text-sm mt-1">${escape_html(action.intervention)}</div> <div class="text-xs text-slate-600 mt-1 italic">Why: ${escape_html(action.rationale)}</div></li>`);
      }
      $$renderer2.push(`<!--]--></ol>`);
    }
    $$renderer2.push(`<!--]--></section></main>`);
  });
}
export {
  _page as default
};
