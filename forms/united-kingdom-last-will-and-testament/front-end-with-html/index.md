# United Kingdom Last Will and Testament — HTML front-end (form + dashboard)

Vanilla ES-module front-end on the Lily Design System. `index.html` is the
one-page will wizard; `dashboard.html` lists will records with their validity
class.

The form is a **will-drafting documentation instrument** for England and Wales,
**not legal advice**. The engine records the testator, the estate, executors,
beneficiaries and shares, guardians and funeral wishes, and the signing and
witnessing facts; it then classifies the will as **valid** (ready to execute),
**incomplete**, or **formality risk**, totals the shares, counts the witnesses,
and raises flags. Precedence: a Wills Act 1837 formality problem gives
formality risk; else missing content gives incomplete; otherwise valid.

Engine: `js/types.js`, `js/rules.js`, `js/grader.js`, `js/flags.js`. Wizard:
`js/form-app.js`. Dashboard: `js/dashboard-app.js`, `js/data.js` (one sample
row per persona in `../examples/personas.json`).
