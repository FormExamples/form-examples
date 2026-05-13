import { h as head, e as escape_html, b as attr_class, f as stringify, l as ensure_array_like, d as derived } from "../../../../chunks/renderer.js";
import { p as page } from "../../../../chunks/index2.js";
import { s as scorecards } from "../../../../chunks/data.js";
import { b as bandToRecommendation, R as RECOMMENDATION_COPY } from "../../../../chunks/recommendation.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const id = derived(() => page.params.id ?? "");
    const row = derived(() => scorecards.find((r) => r.id === id()));
    const bandClass = {
      low: "bg-band-low text-band-low-text",
      borderline: "bg-band-borderline text-band-borderline-text",
      medium: "bg-band-medium text-band-medium-text",
      high: "bg-band-high text-band-high-text"
    };
    head("67dwv3", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Scorecard ${escape_html(id())} — Agile Consulting Dashboard</title>`);
      });
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-4 py-6"><header class="flex items-baseline justify-between gap-3"><h1 class="text-2xl font-bold text-slate-800">Scorecard ${escape_html(id())}</h1> <a href="/" class="text-sm text-blue-600">← Back to dashboard</a></header> `);
    if (!row()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="bg-yellow-50 border border-yellow-300 rounded p-4 mt-4"><p class="text-sm">No scorecard found with id <code>${escape_html(id())}</code> in the bundled sample data.
				The reviewer dashboard hands off the id to the Loco backend
				(<code>/api/scorecards/${escape_html(id())}</code>); without the backend running, only
				the 12 demo rows under <code>src/lib/data.ts</code> are visible.</p></section>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<section class="bg-white border border-slate-300 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Organization &amp; respondent</h2> <dl class="mt-3 grid grid-cols-[10rem_1fr] gap-y-1.5 gap-x-4 text-sm"><dt class="text-slate-600">Organization</dt><dd>${escape_html(row().organizationName)}</dd> <dt class="text-slate-600">Sector</dt><dd>${escape_html(row().sector)}</dd> <dt class="text-slate-600">Size band</dt><dd>${escape_html(row().sizeBand)}</dd> <dt class="text-slate-600">Respondent</dt><dd>${escape_html(row().respondentName)}</dd> <dt class="text-slate-600">Assessment date</dt><dd>${escape_html(row().assessmentDate)}</dd></dl></section> <section class="bg-white border border-slate-300 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Score &amp; readiness band</h2> <div class="mt-3 flex items-end gap-4 flex-wrap"><div><div class="text-3xl font-bold">${escape_html(row().scoreTotal)}</div> <div class="text-xs text-slate-600">/ 16 total</div></div> <div><div class="text-3xl font-bold">${escape_html(row().manifestoSubtotal)}</div> <div class="text-xs text-slate-600">/ 4 manifesto</div></div> <div><div class="text-3xl font-bold">${escape_html(row().principlesSubtotal)}</div> <div class="text-xs text-slate-600">/ 12 principles</div></div> <div class="ml-auto flex flex-col items-end gap-1"><span${attr_class(`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${stringify(bandClass[row().computedBand])}`)}>${escape_html(row().computedBand)}</span> <span class="text-xs text-slate-600">${escape_html(bandToRecommendation(row().computedBand))}</span></div></div> <p class="mt-3 text-sm text-slate-700">${escape_html(RECOMMENDATION_COPY[row().computedBand])}</p></section> <section class="bg-white border border-slate-300 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Readiness flags</h2> `);
      if (row().flags.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-sm text-slate-600 mt-2">No flags fired.</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<ul class="mt-2 space-y-2"><!--[-->`);
        const each_array = ensure_array_like(row().flags);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let flag = each_array[$$index];
          $$renderer2.push(`<li class="rounded border-l-4 border-red-500 bg-red-50 p-2"><div class="font-semibold text-sm">${escape_html(flag.category)} <span class="text-xs text-slate-500">(${escape_html(flag.priority)})</span></div></li>`);
        }
        $$renderer2.push(`<!--]--></ul>`);
      }
      $$renderer2.push(`<!--]--></section> <section class="bg-blue-50 border border-blue-200 rounded p-4 mt-4 text-sm">Item-by-item answers and evidence notes are not bundled in the dashboard
			sample data — fetch <code>/api/scorecards/${escape_html(id())}</code> from the Loco
			backend to see the full assessment.</section>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
