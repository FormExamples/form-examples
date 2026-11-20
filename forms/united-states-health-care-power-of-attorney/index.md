# United States Health Care Power of Attorney

A durable power of attorney for health care: the document in which an adult (the
principal) names an agent, and successor agents, to make health care decisions
if the principal cannot. States call it a health care proxy (New York), a medical
power of attorney (Texas), a designation of health care surrogate (Florida), or
an advance health care directive (California). The same form can carry the
principal's wishes about life-sustaining treatment, a HIPAA release, and a
direction about organ donation.

The form is not a clinical score. Its engine is an **execution-readiness**
engine: it checks that the document is complete, that the agent is eligible, and
that the way it will be signed (witnesses or notary) meets the rule of the
principal's state. It classifies the directive as **Ready to execute**,
**Incomplete**, or **Execution risk**, and raises prioritized flagged issues.

This is documentation support, not legal advice. A court, the treating
facility, and the state decide whether a directive is valid; talk with a
licensed attorney. See the disclaimer in [`spec/index.md`](spec/index.md).

## Legal frame

- **Uniform Health-Care Decisions Act (1993)**, the Uniform Law Commission model
  that many states follow: a written, signed power of attorney for health care
  names an agent; the agent's authority can begin on signing or on incapacity.
- **Federal Patient Self-Determination Act of 1990** (42 U.S.C. 1395cc(f);
  42 CFR 489.100 and 489.102): hospitals, nursing facilities, hospices, home
  health agencies, and managed care plans that take Medicare or Medicaid must
  ask whether a patient has an advance directive, document the answer, give
  written information about the patient's rights, and not condition care on
  having one.
- **HIPAA** (45 CFR 164.502(g) and 164.508): a personal representative can act
  for the individual, and a written authorization lets a named person see
  records before incapacity is certified.
- **Revised Uniform Anatomical Gift Act (2006)**: a person, and an agent when
  the document allows, can direct organ and tissue donation.
- **State statutes**: witness count, notary alternative, who cannot witness, and
  facility rules are state law. The engine encodes eight states in
  `STATE_RULES` (California, New York, Texas, Florida, Illinois, Pennsylvania,
  Ohio, Washington) and falls back to the uniform default, with a "verify state
  rule" flag, for any other state. See [`doc/state-rules.md`](doc/state-rules.md).

## POLST is not the same thing

A health care power of attorney names a decision-maker and states general
wishes; it is a legal document open to every adult, and emergency responders
generally do not follow it. A **POLST** (Physician Orders for Life-Sustaining
Treatment; also POST, MOLST, MOST) is a portable medical order signed by a
clinician, for people with serious illness or frailty, and emergency responders
follow it. A POLST cannot appoint an agent. People with a serious illness
should have both, aligned. The engine raises a flag when a serious illness is
recorded with no POLST.

## Sections

1. **Principal**: name, date of birth, state, capacity and voluntariness.
2. **Agent and successors**: agent identity, age, conflicts, and willingness.
3. **Authority**: when it begins, HIPAA release, mental health, organ donation,
   earlier directives.
4. **Treatment wishes**: life-sustaining treatment, CPR, ventilator, artificial
   nutrition, comfort care, POLST.
5. **Signing and witnesses**: method, each witness's disqualifiers, notary,
   skilled-nursing ombudsman, copies distributed.
6. **Summary**: the live readiness class and the state rule applied.

## Classification

| Class | Meaning |
| --- | --- |
| `ready-to-execute` | Required content present, agent eligible, signing method matches the state rule. |
| `incomplete` | A required field is blank (name, birth date, state, agent, when authority begins, signature date, signing method). |
| `execution-risk` | A defect could invalidate the document: principal under 18, capacity or voluntariness denied, agent ineligible, a barred witness, too few witnesses, a notary where the state does not accept one, or a missing California skilled-nursing ombudsman. |

`execution-risk` takes precedence over `incomplete`.

## Artefacts

- [`spec/index.md`](spec/index.md): the living spec (data model, algorithm, flags).
- [`doc/`](doc/index.md): research and citations.
- `sql/`: PostgreSQL migrations (`principal`, `reviewer`, the main table, and
  the `_grade` / `_grade_rule` / `_grade_flag` triad).
- `front-end-with-html/` and `front-end-with-svelte/`: the wizard and the
  reviewer dashboard.
- `back-end-with-axum/`: the JSON API.
- `examples/personas.json`: eleven personas covering every class and flag.
