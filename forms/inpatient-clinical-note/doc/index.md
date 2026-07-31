# Inpatient Clinical Note — Clinical reference documentation

Reference material behind the note structure, the completeness model, and the
acuity model. See [`../spec/index.md`](../spec/index.md) for the normative spec.

## Contents

- [`record-standards.md`](record-standards.md) — AoMRC record-structure
  standards and GMC record-keeping duties, and how they map onto the twelve
  completeness components.
- [`news2.md`](news2.md) — NEWS2 parameters, scoring tables, escalation
  thresholds, and the scale-1 / scale-2 distinction.
- [`acuity-rules.md`](acuity-rules.md) — the max-band acuity rules, their
  clinical justification, and worked examples.
- [`risk-assessments.md`](risk-assessments.md) — the mandatory inpatient risk
  assessments (VTE, falls, pressure ulcer, delirium, nutrition, infection
  control) and their source guidance.
- [`references.md`](references.md) — full citation list.

## Why a completeness engine rather than a clinical score

Most forms in this monorepo compute a validated clinical score. An inpatient
clinical note has no such instrument: there is no published, validated
"note quality score" that maps free-text clinical documentation onto a risk
band. What *is* published is a set of **structural standards** for what a
clinical record must contain — chiefly the Academy of Medical Royal Colleges
record-structure standards and the GMC's record-keeping duty.

The completeness engine therefore grades the record against those structural
standards, and says so explicitly in every output: a **Complete** grade means
the entry contains the components a clinical record is required to contain. It
is not a statement that the care was correct, and it is not a diagnostic
output. This keeps the form outside the scope of a medical-device diagnostic
function under MDCG 2019-11 Rev.1.

The acuity band is different in kind: it is a **transcription** of NEWS2 and a
small set of objective deterioration markers into an escalation band, following
the RCP's own published thresholds. It computes nothing the RCP chart does not
already compute; it surfaces the escalation the chart already implies, and flags
when that escalation is undocumented.

## Safety case in brief

- Neither grade overrides clinical judgement, and both say so in the rendered
  output.
- The acuity band is overridable by the author with a recorded reason; the
  computed band is retained alongside the final band, so an override is always
  visible in audit.
- The completeness status is not overridable, because it is a mechanical
  property of the record rather than a clinical judgement.
- Every fired rule and every flag is recorded with a stable identifier, so a
  grade can be reproduced and audited after the fact.
- The form never suppresses a flag. A flag with a low priority is still
  rendered.
