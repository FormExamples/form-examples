import "clsx";
import { a as assessment, T as TOTAL_STEPS } from "../../chunks/assessment.svelte.js";
import { e as escape_html, a1 as attr, a2 as attr_style, a3 as stringify, a0 as derived, a4 as bind_props, a5 as attr_class, a6 as ensure_array_like } from "../../chunks/renderer.js";
function ProgressBar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const pct = derived(() => Math.round(assessment.currentStep / TOTAL_STEPS * 100));
    $$renderer2.push(`<div class="my-3" aria-label="Wizard progress"><div class="text-xs text-slate-600">Step ${escape_html(assessment.currentStep)} of ${escape_html(TOTAL_STEPS)}</div> <div class="h-2 bg-slate-200 rounded mt-1"><div class="h-full bg-blue-500 rounded" role="progressbar"${attr("aria-valuenow", pct())} aria-valuemin="0" aria-valuemax="100"${attr_style("", { width: `${stringify(pct())}%` })}></div></div></div>`);
  });
}
function StepNavigation($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="flex justify-between gap-2 mt-6 pt-4 border-t border-slate-200"><button type="button" class="px-4 py-1.5 rounded border border-slate-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"${attr("disabled", assessment.currentStep === 1, true)}>← Back</button> <button type="button" class="px-4 py-1.5 rounded bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"${attr("disabled", assessment.currentStep === TOTAL_STEPS, true)}>Next →</button></div>`);
  });
}
function Step1Organization($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<section><h2 class="text-lg font-semibold text-slate-800">Step 1 — Organization &amp; respondent</h2> <label class="block mt-3 text-sm">Organization name <input type="text" class="w-full mt-1 p-1.5 rounded border border-slate-300"${attr("value", assessment.data.organization.organizationName)}/></label> <label class="block mt-3 text-sm">Sector `);
    $$renderer2.select(
      {
        class: "w-full mt-1 p-1.5 rounded border border-slate-300",
        value: assessment.data.organization.sector
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`—`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`healthcare`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`pharmaceuticals`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`medtech`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`public-sector`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`finance`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`insurance`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`retail`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`manufacturing`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`logistics`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`energy`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`utilities`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`media`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`telecommunications`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`technology`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`education`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`charity`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`agriculture`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`professional-services`);
        });
        $$renderer3.option({}, ($$renderer4) => {
          $$renderer4.push(`other`);
        });
      }
    );
    $$renderer2.push(`</label> <label class="block mt-3 text-sm">Size band `);
    $$renderer2.select(
      {
        class: "w-full mt-1 p-1.5 rounded border border-slate-300",
        value: assessment.data.organization.sizeBand
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`—`);
        });
        $$renderer3.option({ value: "micro" }, ($$renderer4) => {
          $$renderer4.push(`Micro (&lt; 10)`);
        });
        $$renderer3.option({ value: "small" }, ($$renderer4) => {
          $$renderer4.push(`Small (10–49)`);
        });
        $$renderer3.option({ value: "medium" }, ($$renderer4) => {
          $$renderer4.push(`Medium (50–249)`);
        });
        $$renderer3.option({ value: "large" }, ($$renderer4) => {
          $$renderer4.push(`Large (250–999)`);
        });
        $$renderer3.option({ value: "enterprise" }, ($$renderer4) => {
          $$renderer4.push(`Enterprise (1000+)`);
        });
      }
    );
    $$renderer2.push(`</label> <label class="block mt-3 text-sm">Respondent name <input type="text" class="w-full mt-1 p-1.5 rounded border border-slate-300"${attr("value", assessment.data.respondent.respondentName)}/></label> <label class="block mt-3 text-sm">Respondent email <input type="email" class="w-full mt-1 p-1.5 rounded border border-slate-300"${attr("value", assessment.data.respondent.respondentEmail)}/></label> <label class="block mt-3 text-sm">Role `);
    $$renderer2.select(
      {
        class: "w-full mt-1 p-1.5 rounded border border-slate-300",
        value: assessment.data.respondent.role
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`—`);
        });
        $$renderer3.option({ value: "cxo" }, ($$renderer4) => {
          $$renderer4.push(`CXO`);
        });
        $$renderer3.option({ value: "vp" }, ($$renderer4) => {
          $$renderer4.push(`VP`);
        });
        $$renderer3.option({ value: "director" }, ($$renderer4) => {
          $$renderer4.push(`Director`);
        });
        $$renderer3.option({ value: "head-of-product" }, ($$renderer4) => {
          $$renderer4.push(`Head of Product`);
        });
        $$renderer3.option({ value: "head-of-engineering" }, ($$renderer4) => {
          $$renderer4.push(`Head of Engineering`);
        });
        $$renderer3.option({ value: "head-of-delivery" }, ($$renderer4) => {
          $$renderer4.push(`Head of Delivery`);
        });
        $$renderer3.option({ value: "transformation-lead" }, ($$renderer4) => {
          $$renderer4.push(`Transformation Lead`);
        });
        $$renderer3.option({ value: "programme-manager" }, ($$renderer4) => {
          $$renderer4.push(`Programme Manager`);
        });
        $$renderer3.option({ value: "product-manager" }, ($$renderer4) => {
          $$renderer4.push(`Product Manager`);
        });
        $$renderer3.option({ value: "engineering-manager" }, ($$renderer4) => {
          $$renderer4.push(`Engineering Manager`);
        });
        $$renderer3.option({ value: "agile-coach" }, ($$renderer4) => {
          $$renderer4.push(`Agile Coach`);
        });
        $$renderer3.option({ value: "scrum-master" }, ($$renderer4) => {
          $$renderer4.push(`Scrum Master`);
        });
        $$renderer3.option({ value: "consultant" }, ($$renderer4) => {
          $$renderer4.push(`Consultant`);
        });
        $$renderer3.option({ value: "employee" }, ($$renderer4) => {
          $$renderer4.push(`Employee`);
        });
        $$renderer3.option({ value: "other" }, ($$renderer4) => {
          $$renderer4.push(`Other`);
        });
      }
    );
    $$renderer2.push(`</label> <label class="block mt-3 text-sm">Assessment date <input type="date" class="w-full mt-1 p-1.5 rounded border border-slate-300"${attr("value", assessment.data.assessment.assessmentDate)}/></label></section>`);
  });
}
function ChecklistItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { item = void 0, heading, prompt, name } = $$props;
    $$renderer2.push(`<div class="mt-4"><h3 class="text-base font-semibold text-slate-800">${escape_html(heading)}</h3> <p class="text-sm text-slate-600 mt-1">${escape_html(prompt)}</p> <div class="flex flex-wrap gap-4 mt-2" role="radiogroup"${attr("aria-label", heading)}><label class="inline-flex items-center gap-1.5"><input type="radio"${attr("name", name)}${attr("checked", item.done === true, true)}/> Yes</label> <label class="inline-flex items-center gap-1.5"><input type="radio"${attr("name", name)}${attr("checked", item.done === false, true)}/> No</label> <label class="inline-flex items-center gap-1.5"><input type="radio"${attr("name", name)}${attr("checked", item.done === null, true)}/> Unanswered</label></div> <label class="block text-xs text-slate-500 mt-2">Evidence (optional) <textarea class="w-full mt-1 rounded border border-slate-300 p-1.5 text-sm" rows="2">`);
    const $$body = escape_html(item.evidence);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></label></div>`);
    bind_props($$props, { item });
  });
}
function Step2Manifesto($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-lg font-semibold text-slate-800">Step 2 — Agile Manifesto (4 items)</h2> <p class="text-sm text-slate-600 mt-1">Score one point per item your organization can demonstrably tick today.</p> `);
      ChecklistItem($$renderer3, {
        name: "m1",
        heading: "Manifesto 1 — Individuals and interactions",
        prompt: "Every leader is in conversation with customers ≥ 1 hour per week, with weekly results radiated to stakeholders.",
        get item() {
          return assessment.data.manifesto.m1;
        },
        set item($$value) {
          assessment.data.manifesto.m1 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "m2",
        heading: "Manifesto 2 — Working software",
        prompt: "The team has launched a brand-new “hello world” program to production and discussed the experience.",
        get item() {
          return assessment.data.manifesto.m2;
        },
        set item($$value) {
          assessment.data.manifesto.m2 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "m3",
        heading: "Manifesto 3 — Customer collaboration",
        prompt: "The organization has bought copies of the customer’s favourite book and shared with the team (org spend, not personal).",
        get item() {
          return assessment.data.manifesto.m3;
        },
        set item($$value) {
          assessment.data.manifesto.m3 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "m4",
        heading: "Manifesto 4 — Responding to change",
        prompt: "Every senior leader (BoD/CXO/VP/Director) has read one agile change-management book and shared three takeaways.",
        get item() {
          return assessment.data.manifesto.m4;
        },
        set item($$value) {
          assessment.data.manifesto.m4 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step3PrinciplesA($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-lg font-semibold text-slate-800">Step 3 — Principles 1–4</h2> `);
      ChecklistItem($$renderer3, {
        name: "p1",
        heading: "Principle 1 — Customer satisfaction",
        prompt: "Every product lead measures customer Net Promoter Score (NPS).",
        get item() {
          return assessment.data.principles.p1;
        },
        set item($$value) {
          assessment.data.principles.p1 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p2",
        heading: "Principle 2 — Welcome changing requirements",
        prompt: "The “hello world” program has been internationalized to ≥ 1 additional language using the user locale.",
        get item() {
          return assessment.data.principles.p2;
        },
        set item($$value) {
          assessment.data.principles.p2 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p3",
        heading: "Principle 3 — Deliver working software frequently",
        prompt: "The internationalized “hello world” version has been launched to production and verified by a native speaker.",
        get item() {
          return assessment.data.principles.p3;
        },
        set item($$value) {
          assessment.data.principles.p3 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p4",
        heading: "Principle 4 — Business and developers together",
        prompt: "Commitment is in place from every product / project / programme / practice lead.",
        get item() {
          return assessment.data.principles.p4;
        },
        set item($$value) {
          assessment.data.principles.p4 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step4PrinciplesB($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-lg font-semibold text-slate-800">Step 4 — Principles 5–8</h2> `);
      ChecklistItem($$renderer3, {
        name: "p5",
        heading: "Principle 5 — Motivated individuals",
        prompt: "A “3-amigos” team (business + dev + test) has shipped a real new MVP within 30 days and on budget.",
        get item() {
          return assessment.data.principles.p5;
        },
        set item($$value) {
          assessment.data.principles.p5 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p6",
        heading: "Principle 6 — Face-to-face conversation",
        prompt: "Every product owner has committed to ≥ 50% face-to-face time (or weekly-video equivalent for remote teams).",
        get item() {
          return assessment.data.principles.p6;
        },
        set item($$value) {
          assessment.data.principles.p6 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p7",
        heading: "Principle 7 — Working software is the primary measure",
        prompt: "A new “fizz buzz” program has been created and shipped to production.",
        get item() {
          return assessment.data.principles.p7;
        },
        set item($$value) {
          assessment.data.principles.p7 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p8",
        heading: "Principle 8 — Sustainable pace",
        prompt: "All staff have a sustaining budget for ≥ 1 year secured.",
        get item() {
          return assessment.data.principles.p8;
        },
        set item($$value) {
          assessment.data.principles.p8 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step5PrinciplesC($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-lg font-semibold text-slate-800">Step 5 — Principles 9–12</h2> `);
      ChecklistItem($$renderer3, {
        name: "p9",
        heading: "Principle 9 — Technical excellence and good design",
        prompt: "Quality-attribute metrics are wired into pre-commit hooks and continuous integration.",
        get item() {
          return assessment.data.principles.p9;
        },
        set item($$value) {
          assessment.data.principles.p9 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p10",
        heading: "Principle 10 — Simplicity",
        prompt: "Every product team has ≥ 2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC).",
        get item() {
          return assessment.data.principles.p10;
        },
        set item($$value) {
          assessment.data.principles.p10 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p11",
        heading: "Principle 11 — Self-organizing teams",
        prompt: "A 5-point Likert “our team is self-organizing” averages “Agree” or better.",
        get item() {
          return assessment.data.principles.p11;
        },
        set item($$value) {
          assessment.data.principles.p11 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChecklistItem($$renderer3, {
        name: "p12",
        heading: "Principle 12 — Reflection at regular intervals",
        prompt: "Every leader has shared their previous 2 retrospectives with all stakeholders.",
        get item() {
          return assessment.data.principles.p12;
        },
        set item($$value) {
          assessment.data.principles.p12 = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step6ScoreAndSignoff($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const bandClass = derived(() => ({
      low: "bg-band-low text-band-low-text",
      borderline: "bg-band-borderline text-band-borderline-text",
      medium: "bg-band-medium text-band-medium-text",
      high: "bg-band-high text-band-high-text"
    })[assessment.grade.computedBand]);
    const recommendationCopy = {
      low: "Don't hire agile help yet — focus on internal operations first.",
      borderline: "Borderline — do your agile homework first; revisit in ~3 months.",
      medium: "Do your agile homework first; revisit the scorecard in ~3 months.",
      high: "Likely ready — trial an engagement and review in ~3 months."
    };
    $$renderer2.push(`<section><h2 class="text-lg font-semibold text-slate-800">Step 6 — Score &amp; sign-off</h2> <div class="mt-4 grid grid-cols-3 gap-3 text-center"><div class="rounded border border-slate-300 p-3"><div class="text-3xl font-bold">${escape_html(assessment.grade.scoreTotal)}</div> <div class="text-xs text-slate-600">/ 16 total</div></div> <div class="rounded border border-slate-300 p-3"><div class="text-3xl font-bold">${escape_html(assessment.grade.manifestoSubtotal)}</div> <div class="text-xs text-slate-600">/ 4 manifesto</div></div> <div class="rounded border border-slate-300 p-3"><div class="text-3xl font-bold">${escape_html(assessment.grade.principlesSubtotal)}</div> <div class="text-xs text-slate-600">/ 12 principles</div></div></div> <div class="mt-4 flex items-center gap-3"><span${attr_class(`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${stringify(bandClass())}`)}>${escape_html(assessment.grade.computedBand)}</span> <span class="text-sm text-slate-700">${escape_html(recommendationCopy[assessment.grade.computedBand])}</span></div> `);
    if (assessment.grade.additionalFlags.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-4"><h3 class="text-base font-semibold text-slate-800">Readiness flags</h3> <ul class="mt-2 space-y-2"><!--[-->`);
      const each_array = ensure_array_like(assessment.grade.additionalFlags);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let flag = each_array[$$index];
        $$renderer2.push(`<li class="rounded border-l-4 border-red-500 bg-red-50 p-2"><div class="font-semibold text-sm">${escape_html(flag.category)} <span class="text-xs text-slate-500">(${escape_html(flag.priority)})</span></div> <div class="text-sm">${escape_html(flag.description)}</div> <div class="text-xs text-slate-600 mt-1"><strong>Suggested action:</strong> ${escape_html(flag.suggestedAction)}</div></li>`);
      }
      $$renderer2.push(`<!--]--></ul></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <label class="block mt-4 text-sm">Signed by <input type="text" class="w-full mt-1 p-1.5 rounded border border-slate-300" placeholder="Your name"/></label></section>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<main class="max-w-3xl mx-auto px-4 py-6"><header><h1 class="text-2xl font-bold text-slate-800">Agile Consulting Scorecard for Hiring Help</h1> <p class="text-sm text-slate-600 mt-1">Sixteen yes/no checkpoints from the Agile Manifesto and Principles. Score yourself and
			see whether you are ready to hire agile consulting help.</p></header> `);
    ProgressBar($$renderer2);
    $$renderer2.push(`<!----> <div class="bg-white rounded-lg border border-slate-300 p-5 mt-3">`);
    if (assessment.currentStep === 1) {
      $$renderer2.push("<!--[0-->");
      Step1Organization($$renderer2);
    } else if (assessment.currentStep === 2) {
      $$renderer2.push("<!--[1-->");
      Step2Manifesto($$renderer2);
    } else if (assessment.currentStep === 3) {
      $$renderer2.push("<!--[2-->");
      Step3PrinciplesA($$renderer2);
    } else if (assessment.currentStep === 4) {
      $$renderer2.push("<!--[3-->");
      Step4PrinciplesB($$renderer2);
    } else if (assessment.currentStep === 5) {
      $$renderer2.push("<!--[4-->");
      Step5PrinciplesC($$renderer2);
    } else if (assessment.currentStep === 6) {
      $$renderer2.push("<!--[5-->");
      Step6ScoreAndSignoff($$renderer2);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    StepNavigation($$renderer2);
    $$renderer2.push(`<!----></div> <div class="mt-4 flex gap-2"><button type="button" class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm">Reset</button></div></main>`);
  });
}
export {
  _page as default
};
