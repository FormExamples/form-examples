# United States Last Will and Testament — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
United States Last Will and Testament wizard; `dashboard.html` is the drafter dashboard. Shared `css/` and `js/`
(the validity classification engine in `js/{types,rules,grader,flags}.js`, the apps
in `js/form-app.js` and `js/dashboard-app.js`).

The will form is a **documentation and validity-classification instrument**, not a
scored assessment and **not legal advice**. The engine records the testator and
state, the family and spouse, the estate and bequests, the personal
representative and clauses, the execution plan with witnesses, and the
self-proving affidavit. It classifies the plan as **valid-ready-to-execute**,
**incomplete**, or **formality-risk** by precedence (any high-priority flag, then any
missing required answer), computes the residuary total and the estimated spousal
elective share, and raises flags. State rules come from the `STATE_RULES` table in
`js/rules.js` (CA, NY, TX, FL, IL, PA, OH, WA, with the Uniform Probate Code as the
default). There is no numeric score. The probate court decides whether a will is
valid.
