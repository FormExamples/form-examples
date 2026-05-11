# Safety Case Notes — Placeholder

This form is **non-clinical**. The UK NHS Clinical Safety Officer process
(DCB0129 / DCB0160), the EU MDR MDCG 2019-11 classification, and the UK
MHRA Software as a Medical Device guidance do **not** apply to this form.

This document records the non-clinical safety considerations that still apply
to any software tool that collects, scores, and displays information used to
make decisions about software systems.

## Intended purpose

A self-assessment wizard that helps software architects and technical leads
measure the completeness of their arc42 architecture documentation, identify
documentation gaps, and track maturity over time. The tool is advisory; it
does not make autonomous decisions.

## Intended users

Software architects, technical leads, principal engineers, enterprise
architects, solution architects, and development team leads working in any
software-development setting.

## Non-clinical hazard log

| ID | Hazard | Cause | Mitigation |
| --- | --- | --- | --- |
| H-01 | Incorrect maturity score displayed | Engine rule bug | Unit tests (`composite-grader.test.ts`, `completeness-rules.test.ts`); open-source rules in `doc/completeness-rules.md` |
| H-02 | Misleading "Optimised" rating | Respondent inflates scores | Self-assessment limitation stated prominently in the UI; peer-review workflow recommended |
| H-03 | Stale documentation missed | Review date not updated | Stale-documentation flag fires when review date > 180 days; flag rendered in the summary step |
| H-04 | Sensitive architecture information exposed | Report shared unintentionally | Tool stores data locally by default; deployment guide warns about access controls |
| H-05 | Data loss before submission | Browser crash | LocalStorage autosave (future enhancement); warning shown after 10 minutes of inactivity |
| H-06 | Accessibility failure | Architect with vision or motor impairment cannot use form | Axe-core audit (future); WCAG 2.2 AA target |

## Risk level

This tool is not classified as a medical device or safety-critical system.
It is a general-purpose information tool. The risk of harm from an incorrect
maturity score is limited to missed documentation gaps; no patient safety,
financial, or regulatory consequences follow directly from the tool's output.

## Verification evidence

- `composite-grader.test.ts` Vitest unit tests.
- `completeness-rules.test.ts` Vitest unit tests.
- `bin/test-form arc42` structural tests.

## Disclaimer

This form is provided as a reference implementation in the `form-examples`
monorepo. It is not a substitute for a formal architecture review, a security
audit, or a regulatory assessment of the documented system.
