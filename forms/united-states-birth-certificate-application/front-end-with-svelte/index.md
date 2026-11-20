# United States Birth Certificate Application — SvelteKit front-end (form + dashboard)

SvelteKit wizard, report, and applications dashboard for requesting a certified
copy of a US birth certificate, served under
`/united-states-birth-certificate-application/` (RESTful
`/united-states-birth-certificate-applications` list and `/[id]` form). Uses the
Lily Design System headless components, a SVAR grid for the dashboard, and
pdfmake for the PDF report.

This is a **documentation-support instrument**, not legal advice. The engine
(`src/lib/engine/`: `types.ts`, `defaults.ts`, `utils.ts`, `birth-rules.ts`,
`birth-grader.ts`, `flagged-issues.ts`, tests in `birth-grader.test.ts`) mirrors
the HTML engine: `validateApplication(data)` classifies the request as
`ready-to-submit`, `incomplete`, or `ineligible-requester` (precedence in that
reverse order), returns the expected fee and whether a state rule or the
uniform default applied, and the prioritized flagged issues. `STATE_RULES` holds
verified rules for CA, NY, TX, FL, IL, PA, OH and WA. `createDefaultApplication()`
lives in `defaults.ts`, not in the `$app/env`-importing store, so the engine
tests never touch SvelteKit.

## Verify

```sh
pnpm install
pnpm run check
pnpm exec vitest run
pnpm run lint
pnpm run format:check
```
