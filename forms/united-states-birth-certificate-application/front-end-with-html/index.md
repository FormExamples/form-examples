# United States Birth Certificate Application — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
wizard for requesting a certified copy of a US birth certificate;
`dashboard.html` is the applications dashboard. Shared `css/` and `js/` (the
classification engine in `js/{types,rules,grader,flags}.js`, the apps in
`js/form-app.js` + `js/dashboard-app.js`).

This is a **documentation-support instrument**, not legal advice. The engine
collects the requester, the person named on the certificate (the data of the US
Standard Certificate of Live Birth), the relationship and purpose, the order,
the identity documents, and the declaration; it then classifies the request as
**ready to submit**, **incomplete**, or **ineligible requester**, computes the
expected fee, and raises prioritized flags. Classification is by precedence: an
ineligible requester under the state rule comes first, then any blocking gap,
otherwise ready. Verified rules are held for CA, NY, TX, FL, IL, PA, OH and WA
in `js/rules.js` (`STATE_RULES`); any other state uses a uniform default and a
"verify the state rule" flag. The issuing vital records office decides.
