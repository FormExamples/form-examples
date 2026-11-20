# United States Birth Certificate Application

Request a **certified copy of a US birth certificate** from the state or territory vital records office that registered the birth. There is no national registry: each state, the District of Columbia, and each territory issues its own, and the CDC National Center for Health Statistics (NCHS) *Where to Write for Vital Records* directs requesters to the right office. The form collects the data of the US Standard Certificate of Live Birth needed to find the record (name, sex, date, city, county, state, facility, mother's name before first marriage, father's name), who is asking and why, the kind and number of copies, delivery and fee, identity and supporting documents, whether an apostille is needed for use abroad, and the signed declaration.

The engine is not a clinical score. It is a **completeness / validity / eligibility** engine that classifies the request as:

- **Ready to submit**: the requester appears eligible under the state rule and nothing blocking is missing.
- **Incomplete**: something blocking is missing or unsuitable (identifiers, photo ID, proof of relationship, authority document, notarized sworn statement, copy type for the purpose, fee, apostille destination, signed declaration).
- **Ineligible requester**: the relationship is not allowed to obtain a certified copy under the state rule (or a self-requester is under the state's minimum age), so more paperwork will not help.

It also raises prioritized flagged issues (high, medium, low) with a suggested action each, and shows the expected fee.

Verified rules are encoded for eight states (CA, NY, TX, FL, IL, PA, OH, WA). Any other state uses a uniform default (the Model State Vital Statistics Act "direct and tangible interest" set) and raises a "verify the state rule" flag.

**Disclaimer.** Documentation support, not legal advice. The issuing vital records office decides whether a certified copy is issued.

## Wizard steps (one continuous single page)

| Step | Section | Collects |
| --- | --- | --- |
| 1 | Applicant | name, date of birth, email, phone, mailing address |
| 2 | Person named | name, sex, date of birth, city, county, state, facility, mother's and father's names, deceased, adopted |
| 3 | Relationship and purpose | relationship, purpose, apostille need and country |
| 4 | Order | copy type, copies, delivery, fee enclosed |
| 5 | ID and documents | photo ID type and currency, proof of relationship, authority document, notarized sworn statement |
| 6 | Declaration | signed declaration, note |
| 7 | Summary | live class, expected fee, rule in force; submit for the report |

## Layers

SQL (`sql/`, source of truth), generated XML / FHIR R5 / protobuf / OpenAPI, an HTML front-end (`front-end-with-html/`), a SvelteKit front-end (`front-end-with-svelte/`), and an Axum JSON API (`back-end-with-axum/`). See [`spec/index.md`](./spec/index.md) for the contract and [`doc/index.md`](./doc/index.md) for the research and citations.
