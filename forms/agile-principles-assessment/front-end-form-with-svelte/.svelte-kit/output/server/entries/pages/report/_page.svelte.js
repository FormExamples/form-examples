import { e as escape_html, c as ensure_array_like, h as derived } from "../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { F as FlagBanner, P as PRINCIPLES, s as store } from "../../../chunks/FlagBanner.js";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
const fonts = pdfFonts;
const vfs = fonts.pdfMake?.vfs ?? fonts.vfs;
if (vfs) {
  pdfMake.vfs = vfs;
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const r = derived(() => store.result);
    const d = derived(() => store.data);
    $$renderer2.push(`<section class="bg-white p-6 rounded-lg shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 class="text-xl font-semibold">Assessment report</h2> <div class="flex gap-2"><button type="button" class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-sm">Back to form</button> <button type="button" class="px-3 py-1.5 rounded bg-brand-600 text-white hover:bg-brand-700 text-sm">Download PDF</button></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm"><p><strong>Respondent:</strong> ${escape_html(d().respondent.isAnonymous ? "Anonymous" : d().respondent.fullName || "—")}</p> <p><strong>Role:</strong> ${escape_html(d().respondent.isAnonymous ? "—" : d().respondent.role || "—")}</p> <p><strong>Team:</strong> ${escape_html(d().respondent.teamName || "—")}</p> <p><strong>Organisation:</strong> ${escape_html(d().respondent.organisationName || "—")}</p> <p><strong>Date:</strong> ${escape_html(d().respondent.assessmentDate || "—")}</p> <p><strong>Cadence:</strong> ${escape_html(d().respondent.assessmentPeriod || "—")}</p></div> <div class="bg-slate-100 p-4 rounded mb-4"><p><strong>Unweighted mean:</strong> ${escape_html(r().meanScore !== null ? r().meanScore.toFixed(2) : "— (insufficient data)")}
      (${escape_html(r().answeredCount)} / 12 answered)</p> `);
    if (r().weightsCustomised) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p><strong>Weighted mean:</strong> ${escape_html(r().weightedMeanScore !== null ? r().weightedMeanScore.toFixed(2) : "— (insufficient data)")}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <p><strong>Composite maturity:</strong> ${escape_html(r().maturity.toUpperCase())}${escape_html(r().weightsCustomised ? " (weighted)" : "")}</p></div> `);
    FlagBanner($$renderer2, { flags: r().additionalFlags, maturity: r().maturity });
    $$renderer2.push(`<!----> <h3 class="font-semibold mt-4 mb-2">Per-principle scores</h3> <table class="w-full text-sm border-collapse"><thead><tr class="bg-slate-100 text-left"><th class="p-2 border border-slate-200">#</th><th class="p-2 border border-slate-200">Principle</th><th class="p-2 border border-slate-200">Score</th><th class="p-2 border border-slate-200">Band</th><th class="p-2 border border-slate-200">Comment</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(PRINCIPLES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let p = each_array[$$index];
      const resp = d().responses[p.number - 1];
      const band = r().perPrincipleBands[p.number - 1];
      $$renderer2.push(`<tr><td class="p-2 border border-slate-200">P${escape_html(p.number)}</td><td class="p-2 border border-slate-200">${escape_html(p.shortTitle)}</td><td class="p-2 border border-slate-200">${escape_html(resp.score ?? "—")}</td><td class="p-2 border border-slate-200 uppercase">${escape_html(band)}</td><td class="p-2 border border-slate-200">${escape_html(resp.comment || "—")}</td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> `);
    if (d().actionPlan.topAction1 || d().actionPlan.topAction2 || d().actionPlan.topAction3) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<h3 class="font-semibold mt-4 mb-2">Top three actions</h3> <ol class="list-decimal list-inside text-sm space-y-1">`);
      if (d().actionPlan.topAction1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li>${escape_html(d().actionPlan.topAction1)}</li>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (d().actionPlan.topAction2) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li>${escape_html(d().actionPlan.topAction2)}</li>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (d().actionPlan.topAction3) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<li>${escape_html(d().actionPlan.topAction3)}</li>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></ol>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (d().actionPlan.coachNotes) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<h3 class="font-semibold mt-4 mb-2">Coach notes</h3> <p class="text-sm whitespace-pre-line">${escape_html(d().actionPlan.coachNotes)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (d().actionPlan.overallNotes) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<h3 class="font-semibold mt-4 mb-2">Overall notes</h3> <p class="text-sm whitespace-pre-line">${escape_html(d().actionPlan.overallNotes)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section>`);
  });
}
export {
  _page as default
};
