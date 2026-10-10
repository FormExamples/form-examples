# DTAC assessor wizard — HTML front-end (form + dashboard)

Consolidated single-directory HTML front-end: `index.html` is the single-page
wizard (supplier, product and assessor; one step per DTAC section A-G with a
status radio group per criterion; review and sign-off); `dashboard.html` is the
assessor dashboard (sample rows derived from `../examples/personas.json`).
Shared `css/` and `js/`. The scoring engine is `js/{criteria,types,grader,flags}.js`.
