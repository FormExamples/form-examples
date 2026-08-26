# Perioperative medication hold rules

Reference for the `medication` optimization domain. The form records whether a
hold-and-restart plan has been **agreed**; it does not generate one, and the
timings below are reproduced for reference only. The prescriber and the
anaesthetic team own the decision.

## Why this is a domain at all

Unlike the other seven, the medication domain's intervention is a decision
rather than a physiological change. It earns its place because the failure mode
is severe and entirely preventable by asking one question early: *has a plan
been agreed and written down?* A patient arriving on the day with an unheld
SGLT2 inhibitor or an unplanned anticoagulant gap is a cancellation at best.

## The high-consequence three

### SGLT2 inhibitors — euglycaemic diabetic ketoacidosis

Canagliflozin, dapagliflozin, empagliflozin, ertugliflozin.

These can precipitate ketoacidosis **with a normal or near-normal blood
glucose**, which is why it is missed. The perioperative fast, dehydration, and
surgical stress are exactly the triggers. UK guidance is to stop the drug on the
day before surgery and for at least the day of surgery — commonly stated as
3 days for major surgery — and to check ketones, not just glucose, if the
patient is unwell.

Fires `R-MEDICATION-2` and the `sglt2-inhibitor-not-held` flag at high priority
when the drug is in use with no agreed plan.

### GLP-1 receptor agonists — delayed gastric emptying and aspiration

Semaglutide, liraglutide, dulaglutide, exenatide, tirzepatide.

These delay gastric emptying, so a patient may have a full stomach despite
observing standard fasting times. Guidance is evolving; current practice is to
consider withholding the dose before surgery (a week for weekly preparations,
the day of surgery for daily ones), to consider gastric ultrasound, and to treat
the patient as having a potentially full stomach if in doubt.

Fires `R-MEDICATION-3` and the `glp1-agonist-aspiration-risk` flag at high
priority whenever the drug is in use, whether or not a plan exists — the
aspiration consideration belongs to the anaesthetic team on the day regardless.

### Anticoagulants and antiplatelets — bleeding against thrombosis

Warfarin, direct oral anticoagulants (apixaban, rivaroxaban, edoxaban,
dabigatran), heparins; aspirin, clopidogrel, ticagrelor, prasugrel.

The timing depends on the drug, the renal function, the bleeding risk of the
procedure, and the thrombotic risk of stopping — a patient with a recent
drug-eluting stent or a mechanical valve is a different problem from atrial
fibrillation with a low CHA₂DS₂-VASc score. Bridging is not routine and is
itself a source of harm.

Fires `R-MEDICATION-4` and the `anticoagulation-plan-missing` flag at high
priority when either class is in use with no agreed plan.

## The rest

| Class | Perioperative consideration |
| --- | --- |
| ACE inhibitors and ARBs | commonly omitted on the morning of surgery because of refractory intraoperative hypotension; practice varies by indication |
| Systemic corticosteroids | adrenal suppression — the patient may need perioperative supplementation; never stop abruptly |
| Immunosuppressants and biologics | wound healing and infection risk; timing is agreed with the prescribing specialty, often around the dosing interval |
| Hormone therapy and combined oral contraceptives | venous thromboembolism risk; balanced against pregnancy risk and the reason for the therapy |
| Insulin and other diabetes medicines | need a written day-of-surgery plan; see the CPOC diabetes guideline |
| Herbal and complementary products | several affect bleeding or interact with anaesthetic agents; often stopped 1–2 weeks before |
| Lithium, MAOIs, clozapine | specific anaesthetic interactions; discuss with the prescribing team |

## What the form records

Step 4 captures, per class, whether the medicine is in use; and for the whole
list, whether a hold-and-restart plan has been agreed and who agreed it. The
`patient_medication` join table carries the per-medicine detail: dose,
frequency, route, `hold_required`, `hold_start_before_days`,
`restart_after_days`, and `hold_plan_agreed`, so a plan can be recorded per drug
rather than as a single free-text note.

The `medication` catalogue table carries `perioperative_hold_guidance` and
`hold_class`, so a deployment can seed it with local formulary guidance and have
the front-end surface the right prompt.

## References

- Centre for Perioperative Care. *Guideline for Perioperative Care for People
  with Diabetes Mellitus Undergoing Elective and Emergency Surgery.*
- Centre for Perioperative Care. *Preoperative Assessment and Optimization for
  Adult Surgery* (June 2021).
- NICE NG180. *Perioperative care in adults.*
  <https://www.nice.org.uk/guidance/ng180>
- MHRA Drug Safety Update on SGLT2 inhibitors and diabetic ketoacidosis.
- Association of Anaesthetists guidance on GLP-1 receptor agonists and
  perioperative aspiration risk.

Nothing in this file is a prescribing instruction. Confirm every timing against
current local policy and the responsible prescriber.
