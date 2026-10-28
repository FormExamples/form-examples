# Plan: Medical Device Assessment

1. Spec, index, AGENTS (done).
2. SQL migrations 00–07 (done); regenerate XML, FHIR R5, protobuf, OpenAPI, Loco setup.
3. Engine first: pure grader and flag detector with boundary tests for every Annex VIII rule.
4. HTML and SvelteKit front-ends (wizard + dashboard).
5. Loco JSON API crate.
6. Personas in `examples/personas.json` (e.g. bandage I, catheter IIa, hip implant IIb, pacemaker III, diagnostic app IIa, insulin closed loop III).
