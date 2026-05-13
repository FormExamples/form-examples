import { h as head, a as attr, e as escape_html } from "../../../chunks/renderer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let backendUrl = "http://localhost:5150";
    let jsonlText = "";
    head("1kumcmu", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Bulk import — Agile Consulting Dashboard</title>`);
      });
    });
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-4 py-6"><header class="flex items-baseline justify-between gap-3"><h1 class="text-2xl font-bold text-slate-800">Bulk import scorecards</h1> <a href="/" class="text-sm text-blue-600">← Back to dashboard</a></header> <p class="text-sm text-slate-600 mt-1">Upload or paste a JSON-Lines document (one assessment per line). Blank lines
		and lines starting with <code>#</code> are skipped silently. Posted to the
		Rust axum server's <code>/api/bulk-import</code> endpoint, which validates
		every row, scores it, and persists the accepted rows so the dashboard
		reflects the import.</p> <section class="bg-white border border-slate-300 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Backend</h2> <input type="url" class="w-full mt-2 p-1.5 rounded border border-slate-300 text-sm"${attr("value", backendUrl)} placeholder="http://localhost:5150"/></section> <section class="bg-white border border-slate-300 rounded p-4 mt-4"><h2 class="text-lg font-semibold text-slate-800">Document</h2> <input type="file" accept=".jsonl,application/x-ndjson,application/json,text/plain" class="mt-2 text-sm"/> <textarea class="w-full mt-2 p-2 rounded border border-slate-300 font-mono text-xs" rows="10" placeholder="# one JSON object per line
{&quot;organization&quot;:{…},&quot;respondent&quot;:{…},…}
{&quot;organization&quot;:{…},…}">`);
    const $$body = escape_html(jsonlText);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <div class="mt-3 flex gap-2"><button type="button" class="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"${attr("disabled", jsonlText.trim().length === 0, true)}>${escape_html("Import")}</button> <button type="button" class="px-3 py-2 rounded border border-slate-300 bg-white text-slate-700">Clear</button></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main>`);
  });
}
export {
  _page as default
};
