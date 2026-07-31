# Acuity rules

The acuity engine is **max-band**: every rule that fires proposes a band, and
the worst proposed band wins. `stable` is the default when no rule fires. The
band never falls below a fired rule's band, so adding a rule can only ever raise
acuity, never lower it.

Bands are ordered `stable < watch < escalate < critical`.

## Rules

| Rule id | Condition | Band | Justification |
| --- | --- | --- | --- |
| `A-NEWS2-LOW` | NEWS2 0–4 and no parameter scores 3 | stable | RCP low-risk band |
| `A-NEWS2-MEDIUM` | NEWS2 5–6 | watch | RCP medium-risk band: urgent clinician review |
| `A-NEWS2-SINGLE-3` | Any single parameter scores 3 | watch | RCP low–medium band: a single extreme parameter warrants review even at a low aggregate |
| `A-NEWS2-TREND` | `news2_trend == 'worsening'` | watch | A rising score predicts deterioration better than a single reading |
| `A-NEWS2-HIGH` | NEWS2 ≥ 7 | escalate | RCP high-risk band: emergency assessment by a critical-care-competent team |
| `A-NEW-OXYGEN` | `new_oxygen_requirement == 'yes'` | escalate | A new oxygen requirement is an independent deterioration marker |
| `A-NEW-CONFUSION` | ACVPU below Alert and `new_confusion == 'yes'` | escalate | New confusion scores 3 on NEWS2 and is a core delirium and sepsis marker (NICE CG103, NG51) |
| `A-SEPSIS` | `sepsis_screen == 'positive'` | escalate | NICE NG51: a positive screen requires senior review and the sepsis pathway |
| `A-ABNORMAL-UNRESOLVED` | Any investigation abnormal and not actioned | escalate | An unactioned abnormal result is a recognised source of avoidable harm |
| `A-NEWS2-CRITICAL` | NEWS2 ≥ 9 | critical | See the note in [`news2.md`](news2.md) — a dashboard separation of the highest scores, never a downgrade |
| `A-ARREST` | `arrest_call` in (`cardiac`, `respiratory`, `peri-arrest`) | critical | Self-evident |
| `A-CRITICAL-CARE` | `critical_care_referral == 'yes'` | critical | A referral made is a decision already taken that the patient may need organ support |
| `A-ORGAN-SUPPORT` | `new_organ_support` set and not `none` | critical | Organ support started is level-2/3 care by definition |

## Worked examples

**Stable.** RR 16, SpO2 97% on air, BP 128/76, pulse 78, Alert, 36.8 °C. NEWS2
derives to 0. No deterioration markers. Only `A-NEWS2-LOW` fires. Band
`stable`.

**Watch by single parameter.** RR 26 (scores 3), everything else normal. NEWS2
derives to 3 — a low aggregate. `A-NEWS2-LOW` does not fire because a parameter
scores 3; `A-NEWS2-SINGLE-3` fires. Band `watch`. This is the case the
single-parameter rule exists for: the aggregate alone would have understated the
patient.

**Escalate by sepsis.** NEWS2 5 (`A-NEWS2-MEDIUM`, watch) with a positive sepsis
screen (`A-SEPSIS`, escalate). Max-band gives `escalate`. If the note records no
escalation action, `deteriorating-news2-no-escalation` and
`sepsis-screen-positive-no-action` both fire as high-priority flags.

**Critical by referral at a modest score.** NEWS2 6 with a critical-care
referral made. `A-NEWS2-MEDIUM` proposes watch; `A-CRITICAL-CARE` proposes
critical. Max-band gives `critical`. The referral is a clinical decision that
outranks the score, which is exactly why max-band is the right algorithm here —
a mean or a sum would have diluted it.

## Interaction with the completeness engine

The two engines are independent. A note can be `complete` and `critical` (a
well-documented deterioration — the desired state during an acute event), or
`incomplete` and `stable` (a thin entry on a well patient — a documentation
problem, not a clinical one). The dashboard shows both, and the flags are what
tie them together: an `escalate` or `critical` band with no recorded escalation
action raises a high-priority flag regardless of the completeness status.

## Deliberate non-goals

- The engine does not recommend a treatment, a drug, or a destination.
- The engine does not compute a mortality or deterioration probability.
- The engine does not decide whether escalation was clinically appropriate; it
  records whether escalation was **documented** when the observations implied
  it.
