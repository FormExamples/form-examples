# Clinical references

Authoritative guidance underpinning the four-axis grading engine.

## Appropriateness (1–9, anchored on indication match)

There is **no single published 1–9 audiology appropriateness score** (unlike the
ACR Appropriateness Criteria used in radiology). This form anchors the ordinal
1–9 scale on **indication appropriateness** derived from the British Society of
Audiology recommended procedures and NICE NG98, in three bands:
usually-appropriate (7–9), may-be-appropriate (4–6), usually-not-appropriate
(1–3). Mapped per (indication × test type).

| Indication | Typical test | Indicative band |
| --- | --- | --- |
| Hearing loss | Pure-tone + speech audiometry | usually-appropriate |
| Sudden hearing loss | Pure-tone audiometry (urgent) + ENT | usually-appropriate |
| Tinnitus (persistent / unilateral / pulsatile) | Pure-tone audiometry + ENT | usually-appropriate |
| Vertigo (unresolved / recurrent) | Audio-vestibular assessment | usually-appropriate |
| Ototoxic monitoring | OAE / pure-tone audiometry | usually-appropriate |
| Occupational noise | Pure-tone audiometry | may-be-appropriate |
| Hearing-aid review | Hearing-aid assessment | may-be-appropriate |

## Urgency triage tiers (ENT-UK / BAO-HNS / NICE QS185)

| Tier | Target | Triggers |
| --- | --- | --- |
| Emergency | same day | acute presentation with instability / severe associated red flags |
| Urgent | within 24 h to 2 weeks | sudden sensorineural hearing loss (≤ 3 days onset, ≤ 30 days ago → seen within 24 h; > 30 days ago → seen within 2 weeks); unilateral / asymmetric symptoms; ear discharge |
| Routine | standard booking | stable bilateral hearing loss, hearing-aid review, occupational-noise baseline |

Sudden sensorineural hearing loss is an **otological emergency**: early steroid
treatment is time-critical, so the engine auto-escalates `sudden_onset` to at
least urgent.

## Completeness

Percentage of mandatory fields supplied. Indication and the specific clinical
question are weighted highest because they are the most commonly omitted,
highest-value fields for safe vetting.

## Clinical priority

Composite low / moderate / high band combining acuity (triage tier) and
appropriateness, used to order the vetting work queue.

## Sources

- British Society of Audiology — Recommended Procedures.
  <https://www.thebsa.org.uk/>
- NICE NG98 *Hearing loss in adults: assessment and management*.
  <https://www.nice.org.uk/guidance/ng98>
- NICE QS185 *Hearing loss in adults*, quality statement 2 (sudden onset).
  <https://www.nice.org.uk/guidance/qs185/chapter/quality-statement-2-sudden-onset-of-hearing-loss>
- ENT-UK / BAO-HNS sudden sensorineural hearing loss guidance.
  <https://www.entuk.org/>
- BJGP 2020, *Sudden sensorineural hearing loss … guide for primary care*.
  <https://bjgp.org/content/70/692/144>
- AAO-HNS *Clinical Practice Guideline: Sudden Hearing Loss (Update)* 2019.
  <https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/10.1177/0194599819859885>
