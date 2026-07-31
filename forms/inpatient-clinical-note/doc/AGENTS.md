# Inpatient Clinical Note — Clinical reference documentation

Agent instructions for this directory. Hand-maintained clinical and regulatory
reference material behind the note structure, the completeness model, and the
acuity model. Nothing here is generated.

- [`index.md`](index.md) — overview and the safety case in brief
- [`record-standards.md`](record-standards.md) — AoMRC and GMC record standards
- [`news2.md`](news2.md) — NEWS2 scoring tables and escalation thresholds
- [`acuity-rules.md`](acuity-rules.md) — max-band acuity rules and worked examples
- [`risk-assessments.md`](risk-assessments.md) — mandatory inpatient risk assessments
- [`references.md`](references.md) — full citation list

When a rule in [`../spec/index.md`](../spec/index.md) changes, update the
corresponding justification here in the same commit. A rule without a cited
justification is a defect.

See the form root [`../AGENTS.md`](../AGENTS.md) for form-wide conventions and
the repo root [`../../../AGENTS.md`](../../../AGENTS.md) for system-wide tooling.
