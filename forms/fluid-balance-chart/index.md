# Fluid Balance Chart

A bedside record of a patient's fluid **intake** and **output** over a charting
period (typically 24 hours), used to monitor hydration, renal function, and the
response to fluid therapy. The chart captures each timed volume — oral drinks,
intravenous (IV) fluids, enteral (tube) feeds, blood and blood products on the
intake side; urine, drain losses, vomit or nasogastric (NG) aspirate, stool, and
insensible or other losses on the output side — and computes a **running** and
**cumulative net balance** (intake minus output).

The chart's engine is **not** a validated named clinical score. It performs an
arithmetic reconciliation of recorded volumes and grades the resulting **fluid
status**, reporting a classification (**Balanced / Positive / Negative /
Oliguria**) together with the numeric net balance and, where the patient's weight
is recorded, the urine output rate in **mL/kg/h**. It raises safety flags for a
significant positive balance (fluid-overload risk), a significant negative
balance (dehydration / hypovolaemia), **oliguria** (urine output
< 0.5 mL/kg/h), **anuria**, and **incomplete recording**. The output prompts
clinical review; it does not prescribe treatment.

## Scope and intended users

- **Setting:** general and acute wards, high-dependency and intensive-care units
  (ICU), post-operative recovery, and any inpatient setting where fluid status
  is monitored.
- **Users:** ward and ICU nurses and healthcare assistants recording volumes at
  the bedside; prescribers (doctors, advanced nurse practitioners, pharmacists)
  reviewing the running balance to guide fluid prescriptions.
- **Patients:** inpatients of any age receiving or requiring monitoring of fluid
  therapy. Weight is recorded to enable weight-indexed urine-output calculation
  (mL/kg/h); paediatric weight-based thresholds are a downstream concern, not
  encoded here.
- **Not for:** definitive diagnosis of renal failure, dehydration, or heart
  failure; a substitute for clinical examination, weight trends, or laboratory
  results; or a fluid-prescription calculator. The classification is a
  monitoring aid, not a treatment decision.

## Data captured

Recorded on a single continuous single-page wizard.

**Chart context.** Charting clinician name and role, patient identifier, ward or
unit, chart start date and time, charting period in hours (default 24), and the
patient's **weight in kilograms** (used for the mL/kg/h urine-output rate).

**Intake entries** (timed line items; volume in mL). Each entry records a
timestamp, an intake category, an optional route or description, and a volume:

| Category | Examples |
| --- | --- |
| Oral | drinks, sips, ice chips, oral medications with water |
| Intravenous (IV) | crystalloid, colloid, maintenance infusion, IV medication |
| Enteral | nasogastric or gastrostomy feed, flushes |
| Blood / products | packed red cells, platelets, plasma, albumin |
| Other intake | irrigation retained, other measured input |

**Output entries** (timed line items; volume in mL). Each entry records a
timestamp, an output category, an optional description, and a volume:

| Category | Examples |
| --- | --- |
| Urine | catheter, bedpan, urinal (feeds the mL/kg/h calculation) |
| Drains | surgical, chest, wound, biliary |
| Vomit / NG | vomit, nasogastric aspirate loss |
| Stool | measured diarrhoea / stoma output |
| Insensible / other | estimated insensible loss, sweat, other measured output |

## Computation & flag model

The engine is a **pure** function over the recorded entries and weight.

**Totals and net balance.**

```
totalIntakeMl = Σ intake entry volumes
totalOutputMl = Σ output entry volumes
netBalanceMl  = totalIntakeMl − totalOutputMl        // positive = net gain
```

A **running balance** is produced by sorting all entries by timestamp and
accumulating intake as positive and output as negative; the final running value
equals the **cumulative net balance**. Per-category subtotals are also emitted.

**Urine output rate.**

```
urineOutputMl              = Σ urine output entry volumes
hoursObserved              = charting period hours (or span of recorded entries)
urineOutputRateMlPerKgPerH = urineOutputMl / weightKg / hoursObserved   // when weightKg and hours > 0
```

**Fluid-status classification** (single value, in precedence order):

1. **Oliguria** — `weightKg` known and `urineOutputRateMlPerKgPerH < 0.5` over a
   meaningful observation window (default ≥ 6 h).
2. **Positive** — `netBalanceMl ≥ +significantPositiveThresholdMl` (default
   **+1000 mL** per 24 h; scaled to the charting period).
3. **Negative** — `netBalanceMl ≤ −significantNegativeThresholdMl` (default
   **−1000 mL** per 24 h; scaled to the charting period).
4. **Balanced** — otherwise.

**Safety flags** (emitted independently of the classification, each with a
priority):

- **Fluid-overload risk** (high) — net balance at or above the significant
  positive threshold; review for pulmonary / peripheral oedema.
- **Dehydration / hypovolaemia** (high) — net balance at or below the
  significant negative threshold; review perfusion and fluid replacement.
- **Oliguria** (high) — urine output **< 0.5 mL/kg/h** over the observation
  window; the canonical low-urine-output threshold.
- **Anuria** (high) — effectively no urine output (urine output rate
  < 0.05 mL/kg/h, or absolute urine output < 100 mL over ≥ 12 h); urgent review.
- **Incomplete recording** (low / medium) — weight missing (mL/kg/h cannot be
  computed), no entries recorded, or a charting gap longer than the expected
  interval; the balance may be unreliable.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Chart context | charting clinician name and role, patient identifier, ward/unit, chart start date and time, charting period (hours) |
| 2 | Patient weight | weight in kilograms (for mL/kg/h); optional height / age band |
| 3 | Intake entries | one or more timed intake line items (category, route/description, volume mL) |
| 4 | Output entries | one or more timed output line items (category, description, volume mL) |
| 5 | Summary and balance | computed total intake, total output, net balance, running balance, urine output rate (mL/kg/h), fluid-status classification, fired safety flags, escalation note, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The computation engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a monitoring
  and clinical-decision-support tool; the output prompts review rather than
  determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- National Institute for Health and Care Excellence. *Intravenous fluid therapy
  in adults in hospital.* NICE CG174 (2013, updated 2017).
- Kidney Disease: Improving Global Outcomes (KDIGO). *Clinical Practice
  Guideline for Acute Kidney Injury.* 2012 — oliguria defined as urine output
  < 0.5 mL/kg/h.
- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- National Confidential Enquiry into Patient Outcome and Death (NCEPOD).
  *An Acute Problem?* (2005) — fluid balance monitoring in acutely ill patients.

## Verify

```sh
bin/test-form fluid-balance-chart
```
</content>
