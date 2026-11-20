# US Standard Certificate of Death (NCHS 2003 revision)

A **documentation-support and validity-classification** form for the
[U.S. Standard Certificate of Death](https://www.cdc.gov/nchs/data/dvs/DEATH11-03final-acc.pdf)
as completed by the funeral director and the medical certifier. It is not a
clinical score, not a diagnostic tool, and **not legal advice**: the registering
state agency decides whether a certificate is accepted.

One continuous single-page wizard collects the items in eleven steps:

| Step | Section | Completed by |
|---|---|---|
| 1 | State of registration and decedent | Funeral director |
| 2 | Death details (date, time, place type, facility) | Funeral director / certifier |
| 3 | Certifier (name, type, license, date, attended, last seen alive) | Medical certifier |
| 4 | Part I cause-of-death chain, lines (a) to (d), each with an interval | Medical certifier |
| 5 | Part II other significant conditions, and autopsy | Medical certifier |
| 6 | Manner of death, tobacco, pregnancy | Medical certifier |
| 7 | Injury items | Medical certifier |
| 8 | Medical examiner or coroner referral | Certifier |
| 9 | Funeral director, disposition, date filed | Funeral director |
| 10 | Certified copies (count, requester, identity check, fee) | Funeral director / requester |
| 11 | Summary and validity | (computed) |

## Engine

Three classes, a derived underlying cause, and prioritized flags; no numeric score.

| Class | Meaning |
|---|---|
| `valid` | Required items present, Part I line (a) states a disease or injury, no mechanism of death stands alone, no referral criterion met. |
| `incomplete` | Part I line (a) missing, a mechanism of death is the only cause, or a required item is blank. |
| `refer-to-medical-examiner-or-coroner` | A referral answer or listed reason, a non-natural manner, injury or poisoning wording in the cause lines, or an unattended death. Takes precedence over completeness. Not raised when the certifier is already the medical examiner or coroner. |

Part I rules follow the NCHS *Physicians' Handbook on Medical Certification of
Death*: no mechanism of dying ("cardiac arrest", "respiratory arrest", "heart
failure", "old age") alone; terms in full with no abbreviations except HIV and
AIDS; diabetes type and cancer site and cell type; an interval on each line; a
chain that reads downward.

`STATE_RULES` holds the filing deadline, certification deadline and
certified-copy fee for eight states (CA, NY, TX, FL, IL, PA, OH, WA). Other
states use the uniform default and raise a "verify state rule" flag. Each value
has a `verified` marker; see [`doc/index.md`](doc/index.md).

## Directory map

- [`spec/index.md`](spec/index.md) living spec; [`doc/index.md`](doc/index.md) sources
- [`sql/`](sql/) source of truth; `xml/`, `fhir/`, `protobuf/`, `openapi/` generated
- [`front-end-with-html/`](front-end-with-html/), [`front-end-with-svelte/`](front-end-with-svelte/), [`back-end-with-axum/`](back-end-with-axum/)
- [`examples/`](examples/) fixtures and ten personas

Disclaimer: documentation support, not legal advice. The issuing agency or court decides.
