import { h as head, e as escape_html, a5 as attr_class, a3 as stringify, a6 as ensure_array_like, a0 as derived } from "../../../chunks/renderer.js";
import "../../../chunks/schema.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let priorJsonText = "";
    const diff = derived(() => null);
    const deltaClass = (n) => n > 0 ? "text-green-700" : n < 0 ? "text-red-700" : "text-slate-500";
    const bandClass = {
      low: "bg-band-low text-band-low-text",
      borderline: "bg-band-borderline text-band-borderline-text",
      medium: "bg-band-medium text-band-medium-text",
      high: "bg-band-high text-band-high-text"
    };
    const ITEM_LABEL = {
      m1: "Manifesto 1 — Individuals and interactions",
      m2: "Manifesto 2 — Working software",
      m3: "Manifesto 3 — Customer collaboration",
      m4: "Manifesto 4 — Responding to change",
      p1: "Principle 1 — Customer satisfaction",
      p2: "Principle 2 — Welcome changing requirements",
      p3: "Principle 3 — Deliver frequently",
      p4: "Principle 4 — Business + developers daily",
      p5: "Principle 5 — Motivated individuals",
      p6: "Principle 6 — Face-to-face",
      p7: "Principle 7 — Working software primary measure",
      p8: "Principle 8 — Sustainable pace",
      p9: "Principle 9 — Technical excellence",
      p10: "Principle 10 — Simplicity",
      p11: "Principle 11 — Self-organizing teams",
      p12: "Principle 12 — Reflection"
    };
    const answerLabel = (a) => a === true ? "Yes" : a === false ? "No" : "—";
    head("1xcdwp0", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Diff — Agile Consulting Scorecard</title>`);
      });
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-4 py-6"><header class="flex items-baseline justify-between gap-3"><h1 class="text-2xl font-bold text-slate-800">Compare with prior snapshot</h1> <a href="/" class="text-sm text-blue-600">← Back to wizard</a></header> <p class="text-sm text-slate-600 mt-1">Load a previously exported assessment (the JSON you downloaded last time)
		to see what's changed since then. Useful for the "retake in ~3 months"
		check-in recommended by the seed.</p> <section class="bg-blue-50 border border-blue-200 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Load prior assessment</h2> <div class="flex flex-wrap gap-2 mt-2"><input type="file" accept="application/json,.json"/> <button type="button" class="px-3 py-1.5 rounded border border-blue-500 bg-white text-blue-700 text-sm">Load pasted JSON</button></div> <textarea class="w-full mt-2 p-2 rounded border border-slate-300 font-mono text-xs" rows="4" placeholder="…or paste assessment JSON here">`);
    const $$body = escape_html(priorJsonText);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> `);
    if (diff()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<section class="bg-white border border-slate-300 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Summary</h2> <div class="grid grid-cols-3 gap-3 mt-3 text-center"><div class="rounded border border-slate-300 p-3"><div${attr_class(`text-2xl font-bold ${stringify(deltaClass(diff().scoreDelta))}`)}>${escape_html(diff().scoreDelta > 0 ? "+" : "")}${escape_html(diff().scoreDelta)}</div> <div class="text-xs text-slate-600">total points</div></div> <div class="rounded border border-slate-300 p-3"><div${attr_class(`text-2xl font-bold ${stringify(deltaClass(diff().manifestoDelta))}`)}>${escape_html(diff().manifestoDelta > 0 ? "+" : "")}${escape_html(diff().manifestoDelta)}</div> <div class="text-xs text-slate-600">manifesto</div></div> <div class="rounded border border-slate-300 p-3"><div${attr_class(`text-2xl font-bold ${stringify(deltaClass(diff().principlesDelta))}`)}>${escape_html(diff().principlesDelta > 0 ? "+" : "")}${escape_html(diff().principlesDelta)}</div> <div class="text-xs text-slate-600">principles</div></div></div> <div class="mt-4 flex items-center gap-3 flex-wrap"><span class="text-sm text-slate-600">Band</span> <span${attr_class(`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase ${stringify(bandClass[diff().bandBefore])}`)}>${escape_html(diff().bandBefore)}</span> <span class="text-slate-400">→</span> <span${attr_class(`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase ${stringify(bandClass[diff().bandAfter])}`)}>${escape_html(diff().bandAfter)}</span> `);
      if (diff().bandChanged) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-sm font-semibold text-blue-700">band changed</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="text-sm text-slate-500">band unchanged</span>`);
      }
      $$renderer2.push(`<!--]--></div></section> `);
      if (diff().improved.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="bg-green-50 border border-green-200 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-green-900">Improved (${escape_html(diff().improved.length)})</h2> <ul class="mt-2 space-y-1 text-sm"><!--[-->`);
        const each_array = ensure_array_like(diff().improved);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let item = each_array[$$index];
          $$renderer2.push(`<li><strong>${escape_html(ITEM_LABEL[item.itemKey] ?? item.itemKey)}</strong> —
							${escape_html(answerLabel(item.before))} → ${escape_html(answerLabel(item.after))}</li>`);
        }
        $$renderer2.push(`<!--]--></ul></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (diff().regressed.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="bg-red-50 border border-red-200 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-red-900">Regressed (${escape_html(diff().regressed.length)})</h2> <ul class="mt-2 space-y-1 text-sm"><!--[-->`);
        const each_array_1 = ensure_array_like(diff().regressed);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let item = each_array_1[$$index_1];
          $$renderer2.push(`<li><strong>${escape_html(ITEM_LABEL[item.itemKey] ?? item.itemKey)}</strong> —
							${escape_html(answerLabel(item.before))} → ${escape_html(answerLabel(item.after))}</li>`);
        }
        $$renderer2.push(`<!--]--></ul></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (diff().newFlags.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="bg-red-50 border border-red-200 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-red-900">New flags (${escape_html(diff().newFlags.length)})</h2> <ul class="mt-2 space-y-1 text-sm"><!--[-->`);
        const each_array_2 = ensure_array_like(diff().newFlags);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let flag = each_array_2[$$index_2];
          $$renderer2.push(`<li><strong>${escape_html(flag.category)}</strong> (${escape_html(flag.priority)})</li>`);
        }
        $$renderer2.push(`<!--]--></ul></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (diff().clearedFlags.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="bg-green-50 border border-green-200 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-green-900">Cleared flags (${escape_html(diff().clearedFlags.length)})</h2> <ul class="mt-2 space-y-1 text-sm"><!--[-->`);
        const each_array_3 = ensure_array_like(diff().clearedFlags);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let flag = each_array_3[$$index_3];
          $$renderer2.push(`<li><strong>${escape_html(flag.category)}</strong> (${escape_html(flag.priority)})</li>`);
        }
        $$renderer2.push(`<!--]--></ul></section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (diff().improved.length === 0 && diff().regressed.length === 0 && diff().newFlags.length === 0 && diff().clearedFlags.length === 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<section class="bg-slate-50 border border-slate-300 rounded p-4 mt-4 text-sm text-slate-600">No item-level or flag-level changes between the two snapshots.</section>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<section class="bg-slate-50 border border-slate-300 rounded p-4 mt-4 text-sm text-slate-600">No prior snapshot loaded yet. The "current" snapshot is the one held by
			the wizard (visit <a href="/" class="text-blue-600 underline">/</a> to
			edit it).</section>`);
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
