# United States Last Will and Testament

A planning and validity-checking form for a United States will. A single
continuous single-page wizard collects the testator and state, the family and
spouse, the estate and the specific and residuary bequests, the personal
representative and standard clauses, the execution plan with witnesses, and the
self-proving affidavit. The engine classifies the plan as
**valid-ready-to-execute**, **incomplete**, or **formality-risk** and raises
prioritized flagged issues.

It is **documentation support, not legal advice**. Will law is state law, so the
engine uses the Uniform Probate Code (UPC) as the default and a `STATE_RULES`
table for California, New York, Texas, Florida, Illinois, Pennsylvania, Ohio and
Washington; an unlisted state uses the UPC default and raises a "verify state
rule" flag. The probate court decides whether a will is valid.

## What it checks

- **Capacity:** the testator is 18 or older on the execution date and of sound
  mind, with no sign of undue influence (UPC 2-501).
- **Formalities:** a signature at the end; for a witnessed will, two adult
  witnesses who watch the signing or hear the acknowledgment (UPC 2-502), and in
  some states sign in the testator's presence; holographic wills only where the
  state recognizes them, entirely in the testator's handwriting; electronic wills
  only where a statute allows.
- **Interested witnesses:** a witness who also takes under the will risks the
  gift, depending on the state: valid (Florida), a rebuttable presumption
  (California, Washington), or void unless enough disinterested witnesses signed
  (New York, Texas, Illinois, Ohio, Pennsylvania).
- **Bequest arithmetic:** residuary percentages add up to exactly 100%; specific
  bequests do not exceed the estate; a residuary clause and a backup beneficiary
  exist.
- **Spouse and family:** the spousal elective share (or community property), a
  guardian for minor children, a named omitted child.
- **Self-proving affidavit:** signed before a notary where the state requires it
  (California accepts a declaration under penalty of perjury; Ohio does not use
  one).
- **Clauses:** revocation of prior wills, no-contest clause enforceability,
  digital assets (RUFADAA), safekeeping of the original.
- **Estate tax:** an estate above the 2026 federal exclusion of $15,000,000 or a
  state exclusion (New York, Illinois, Washington), or Pennsylvania inheritance
  tax.

## Classes

| Class | Meaning |
| --- | --- |
| `valid-ready-to-execute` | no high-priority flag and nothing required is missing; medium and low flags may remain |
| `incomplete` | a required answer is missing, and no high-priority flag fires |
| `formality-risk` | at least one high-priority flag could make the will, or a gift in it, fail |

`formality-risk` takes precedence over `incomplete`.

## Steps

1. Testator and state
2. Family and spouse
3. Estate and bequests
4. Representative and clauses
5. Execution and witnesses
6. Self-proving affidavit
7. Summary and validity (live status, then the report)

## Layout

- [`spec/index.md`](spec/index.md): the living domain spec, with the state-rule
  table and the flag catalogue.
- [`doc/index.md`](doc/index.md): research, citations, and what was and was not
  verified against primary sources.
- `sql/`: PostgreSQL schema, source of truth (`testator`, `attorney`, the will, and
  the `_grade` / `_grade_rule` / `_grade_flag` triad).
- `front-end-with-html/`, `front-end-with-svelte/`: wizard and drafter dashboard.
- `back-end-with-axum/`: Rust JSON API, one controller per table.
- `examples/personas.json`: 13 personas covering every class and every flag.

## Verify

```sh
bin/test-form united-states-last-will-and-testament
bin/test-personas united-states-last-will-and-testament
bin/test-engines united-states-last-will-and-testament
```
