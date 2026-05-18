import { a0 as ensure_array_like, e as escape_html, a1 as attr, a2 as attr_class, a3 as stringify, $ as derived } from "../../chunks/renderer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let rows = [];
    let filterMaturity = "";
    let filterRole = "";
    let sortKey = "date";
    let view = "individuals";
    const filtered = derived(() => rows.filter((r) => !filterMaturity).filter((r) => !filterRole).slice().sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null || av === void 0) return 1;
      if (bv === null || bv === void 0) return -1;
      if (av < bv) return 1;
      if (av > bv) return -1;
      return 0;
    }));
    const totals = derived(() => {
      const t = {
        optimising: 0,
        mature: 0,
        developing: 0,
        initial: 0,
        "ad-hoc": 0,
        "insufficient-data": 0
      };
      for (const r of rows) t[r.maturity] = (t[r.maturity] ?? 0) + 1;
      return t;
    });
    function rowClass(m) {
      const map = {
        optimising: "bg-emerald-50",
        mature: "bg-green-50",
        developing: "bg-yellow-50",
        initial: "bg-orange-50",
        "ad-hoc": "bg-red-50",
        "insufficient-data": "bg-slate-50"
      };
      return map[m] ?? "";
    }
    function pct(p) {
      return p === null ? "—" : `${p.toFixed(0)}%`;
    }
    const ROLES = [
      "team-member",
      "team-lead",
      "scrum-master",
      "product-owner",
      "engineering-manager",
      "agile-coach",
      "executive-sponsor",
      "other"
    ];
    $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(totals()));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [m, n] = each_array[$$index];
      $$renderer2.push(`<div class="bg-white border border-slate-200 rounded p-3"><p class="text-xs uppercase text-slate-500">${escape_html(m)}</p> <p class="text-2xl font-semibold">${escape_html(n)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex flex-wrap gap-3 mb-4 items-end"><label class="block"><span class="text-sm block">Maturity</span> `);
    $$renderer2.select(
      {
        class: "border border-slate-300 rounded px-2 py-1",
        value: filterMaturity
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`All`);
        });
        $$renderer3.option({ value: "optimising" }, ($$renderer4) => {
          $$renderer4.push(`Optimising`);
        });
        $$renderer3.option({ value: "mature" }, ($$renderer4) => {
          $$renderer4.push(`Mature`);
        });
        $$renderer3.option({ value: "developing" }, ($$renderer4) => {
          $$renderer4.push(`Developing`);
        });
        $$renderer3.option({ value: "initial" }, ($$renderer4) => {
          $$renderer4.push(`Initial`);
        });
        $$renderer3.option({ value: "ad-hoc" }, ($$renderer4) => {
          $$renderer4.push(`Ad-hoc`);
        });
        $$renderer3.option({ value: "insufficient-data" }, ($$renderer4) => {
          $$renderer4.push(`Insufficient data`);
        });
      }
    );
    $$renderer2.push(`</label> <label class="block"><span class="text-sm block">Role</span> `);
    $$renderer2.select(
      {
        class: "border border-slate-300 rounded px-2 py-1",
        value: filterRole
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`All`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(ROLES);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let r = each_array_1[$$index_1];
          $$renderer3.option({ value: r }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(r)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</label> <div class="ml-auto flex items-center gap-3"><div role="tablist" class="inline-flex border border-slate-300 rounded overflow-hidden text-sm"><button type="button" role="tab"${attr("aria-selected", view === "individuals")}${attr_class(`px-3 py-1 ${stringify("bg-brand-600 text-white")}`)}>Individuals</button> <button type="button" role="tab"${attr("aria-selected", view === "teams")}${attr_class(`px-3 py-1 ${stringify("bg-white text-slate-700")}`)}>Teams</button></div> <button type="button" class="px-3 py-1 text-sm border border-slate-300 rounded bg-white hover:bg-slate-100">Export CSV</button> <p class="text-sm text-slate-500">${escape_html(filtered().length)} results</p></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-white rounded-lg shadow overflow-x-auto"><table class="min-w-full text-sm"><thead class="bg-slate-100 text-left"><tr><th class="p-2 cursor-pointer">Date</th><th class="p-2 cursor-pointer">Respondent</th><th class="p-2 cursor-pointer">Role</th><th class="p-2 cursor-pointer">Team</th><th class="p-2">Org</th><th class="p-2">Answered</th><th class="p-2">Teams</th><th class="p-2">Stakeholders</th><th class="p-2">Practices</th><th class="p-2 cursor-pointer">Overall</th><th class="p-2 cursor-pointer">Maturity</th><th class="p-2">Weak</th><th class="p-2">Flags</th></tr></thead><tbody><!--[-->`);
      const each_array_2 = ensure_array_like(filtered());
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let r = each_array_2[$$index_2];
        $$renderer2.push(`<tr${attr_class(`${stringify(rowClass(r.maturity))} border-b border-slate-200`)}><td class="p-2">${escape_html(r.date)}</td><td class="p-2 font-medium">${escape_html(r.isAnonymous ? "Anonymous" : r.respondent)} `);
        if (r.isAnonymous) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="ml-1 text-xs text-slate-500" title="Anonymous submission">🔒</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="p-2 text-slate-600">${escape_html(r.isAnonymous ? "—" : r.role)}</td><td class="p-2">${escape_html(r.team)}</td><td class="p-2">${escape_html(r.organisation)}</td><td class="p-2 text-center">${escape_html(r.answered)}/57</td><td class="p-2">${escape_html(pct(r.teamsPercent))}</td><td class="p-2">${escape_html(pct(r.stakeholdersPercent))}</td><td class="p-2">${escape_html(pct(r.practicesPercent))}</td><td class="p-2 font-semibold">${escape_html(pct(r.overallPercent))}</td><td class="p-2 uppercase">${escape_html(r.maturity)}</td><td class="p-2 text-xs">${escape_html(r.weakSections.join(", ") || "—")}</td><td class="p-2 text-xs">${escape_html(r.flags.join(", ") || "—")}</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--> <p class="text-xs text-slate-500 mt-4">Falls back to sample data when no backend is reachable. In production rows
  come from the Rust backend's <code>/api/checklists</code> endpoint.</p>`);
  });
}
export {
  _page as default
};
