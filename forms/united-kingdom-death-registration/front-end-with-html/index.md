# United Kingdom death registration — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
death-registration wizard; `dashboard.html` is the registrations dashboard. Shared
`css/` and `js/` (the completeness engine in `js/{types,rules,grader,flags}.js`, the
apps in `js/form-app.js` + `js/dashboard-app.js`).

The form is a **completeness and validity** instrument, not a scored assessment and
**not legal advice**. The engine records the deceased and the death, the medical
examiner's confirmation, the coroner status, the informant, the registration
appointment and the aftercare (green form, Tell Us Once, certified copies); it then
classifies the registration as **ready to register**, **incomplete**, **referred to
coroner - pending** or **registered**, derives the **5-day deadline status**, and
raises flags. Precedence: a pending coroner referral first, then any blocking rule,
then a recorded registration date, else ready. The registrar's own checks remain
definitive.
