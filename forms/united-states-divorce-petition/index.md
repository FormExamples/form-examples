# United States Divorce Petition

Petition for dissolution of marriage, the divorce decree and the vital-records
divorce certificate for United States courts. A single continuous wizard
collects the filing state and county, spouses and residency, children and child
support, property division (community or equitable), service of process, and the
decree; the engine checks the filing state's residency, separation and
waiting-period rules and classifies the petition as **ready to file**,
**incomplete**, or **not yet eligible**, with prioritized flags.

This is documentation support, not legal advice. Divorce is state law and the
court decides.

## Steps

| Step | Section | What it captures |
| --- | --- | --- |
| 1 | Filing and grounds | state, county, filing date, uncontested or contested, no-fault or fault ground |
| 2 | Spouses and residency | names, marriage, separation date, state and county residency, military respondent |
| 3 | Children and support | minor children, UCCJEA home-state months, custody plan, child-support worksheet |
| 4 | Property and settlement | community or equitable, settlement agreement, financial disclosure, spousal support |
| 5 | Service of process | method, date, respondent response |
| 6 | Decree and certificate | decree entered and date, name restoration, divorce certificate |
| 7 | Summary | live readiness, property regime, earliest decree date; submit for the report |

## Engine

`validatePetition(petition)` returns the readiness class, the filing state's
property regime, the earliest permitted decree date and whether the state is in
the verified rule table; `detectFlaggedIssues(petition)` returns the flags. See
[`spec/index.md`](spec/index.md) for the rules and
[`doc/index.md`](doc/index.md) for the verified state table and sources
(California, New York, Texas, Florida, Illinois, Pennsylvania, Ohio,
Washington, Arizona, Nevada; other states fall back to a default with a "verify
state rule" flag).

## Layers

SQL (`sql/`), generated XML, FHIR R5, Protocol Buffers and OpenAPI, an HTML
front-end (`front-end-with-html/`), a SvelteKit front-end
(`front-end-with-svelte/`) and an Axum JSON API (`back-end-with-axum/`).
