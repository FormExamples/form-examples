# United States Durable Financial Power of Attorney — HTML front-end (form + dashboard)

Vanilla JavaScript ES modules, no build step, Lily Design System. `index.html`
is the seven-step single-page wizard; `dashboard.html` is the readiness
dashboard.

The form is an **execution-readiness instrument**, not a scored assessment and
not legal advice. The engine (`js/rules.js`, `js/grader.js`, `js/flags.js`)
checks the notary, witness, effectiveness, hot-power, and gifting plan against
the governing state's rule (Uniform Power of Attorney Act baseline plus a
`STATE_RULES` table for CA, NY, TX, FL, IL, PA, OH, WA), classifies it as
**ready to execute**, **incomplete**, or **execution risk**, and raises flagged
issues. An answered item that contradicts the state rule is an execution risk;
an unanswered core item is incomplete; unknown states use the uniform default
and a flag to verify the local rule. The statute, the notary, and a court decide
validity.
