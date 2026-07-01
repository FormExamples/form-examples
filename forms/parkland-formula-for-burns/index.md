# Parkland Formula for Burns

A fluid-resuscitation calculator for adults and children with major thermal
burns. It computes the total volume of crystalloid (Hartmann's solution /
lactated Ringer's) to give in the first 24 hours from the time of injury using
the **Parkland formula**, splits that volume into the mandated **first-8-hour**
and **next-16-hour** phases, derives an **infusion rate** for each phase, and
offsets the schedule when resuscitation begins some time after the burn. The
output is a titratable starting prescription — fluid must then be adjusted to
maintain an adequate **urine output**, not driven by the formula alone.

The Parkland (Baxter) formula was described by Charles Baxter and Tom Shires at
Parkland Memorial Hospital and remains the most widely taught initial burns
fluid-resuscitation estimate. It is a starting point for the first 24 hours;
ongoing management is guided by physiological endpoints (urine output, mean
arterial pressure, lactate, base deficit) and by a specialist burns service.

## Scope and intended users

- **Setting:** emergency department, major-trauma and burns units, intensive
  care, retrieval / transfer services, and any acute setting managing the first
  24 hours of a major burn.
- **Users:** emergency physicians, burns and plastic-surgery teams, intensivists,
  anaesthetists, trauma nurses, and retrieval clinicians.
- **Patients:** adults and children with significant thermal burns, typically
  **≥ 15% total body surface area (TBSA)** in adults or **≥ 10%** in children,
  where formal fluid resuscitation is indicated.
- **Not for:** definitive burns management, superficial (epidermal / simple
  erythema) burns which are excluded from the TBSA calculation, or as a
  substitute for specialist burns advice, airway assessment, or titration to
  physiological endpoints. The formula estimates a starting volume only.

## Calculation

**Primary instrument:** the Parkland formula for the first 24 hours from the
time of injury.

```
total24hVolumeMl = 4 × weightKg × tbsaPercent
```

- `4` mL is the Parkland coefficient (mL per kg per %TBSA).
- `weightKg` is the patient's body weight in kilograms.
- `tbsaPercent` is the percentage of total body surface area with
  **partial-thickness or deeper** burns, estimated by the **Wallace Rule of
  Nines** or a **Lund–Browder** chart. **Superficial (epidermal) burns are
  excluded.**

**Phase split (mandated by the formula).** Half of the total is given in the
first 8 hours **measured from the time of injury**, the remaining half over the
next 16 hours:

```
first8hVolumeMl = total24hVolumeMl / 2
next16hVolumeMl = total24hVolumeMl / 2
```

**Time-since-injury offset.** Resuscitation frequently starts after the burn
(pre-hospital delay, transfer). The first-8-hour volume must still be delivered
by the **8-hour mark from injury**, so the effective infusion window shrinks by
the elapsed time:

```
hoursSinceInjury      = (assessment time − time of injury) in hours
remainingFirst8hHours = max(8 − hoursSinceInjury, 0)
```

If more than 8 hours have already elapsed, the first phase is overdue: give the
outstanding first-phase volume as a priority and re-plan against the 24-hour
total.

**Infusion rates.**

```
first8hRateMlPerHour  = remainingFirst8hHours > 0
                          ? first8hVolumeMl / remainingFirst8hHours
                          : (overdue — give now)
next16hRateMlPerHour  = next16hVolumeMl / 16
```

**Titration target (urine output).** The formula only estimates a starting
volume. Fluids are then titrated to a target **urine output** of **0.5–1.0
mL/kg/h in adults** (commonly **1–2 mL/kg/h in children**, and higher for
electrical / inhalational injury). Rising urine output allows the rate to be
reduced; falling output prompts an increase and senior review.

| Output | Meaning |
| --- | --- |
| `total24hVolumeMl` | total crystalloid for the first 24 h from injury |
| `first8hVolumeMl` + `first8hRateMlPerHour` | first-phase volume and hourly rate over the remaining first-8-h window |
| `next16hVolumeMl` + `next16hRateMlPerHour` | second-phase volume and hourly rate |
| `targetUrineOutputMlPerHour` | titration endpoint band derived from weight |

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, care setting, date and time of assessment |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Weight | body weight in kilograms |
| 4 | Burn extent | %TBSA burned (partial-thickness or deeper), estimation method (Rule of Nines / Lund–Browder) |
| 5 | Time of injury | date and time the burn occurred; whether time is known or estimated |
| 6 | Injury features | inhalation-injury suspicion, circumferential / deep burn, electrical or chemical mechanism |
| 7 | Summary and plan | computed total, phase volumes and rates, time-offset, urine-output target, flagged issues, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The calculation engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a fluid-dosing
  calculator that informs clinical management; it provides a starting estimate
  for a clinician to review and titrate, and does not itself administer therapy.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Baxter C.R., Shires T. Physiological response to crystalloid resuscitation of
  severe burns. *Ann N Y Acad Sci* 1968; 150(3):874–894.
- Wallace A.B. The exposure treatment of burns. *Lancet* 1951; 1(6653):501–504
  (Rule of Nines).
- Lund C.C., Browder N.C. The estimation of areas of burns. *Surg Gynecol
  Obstet* 1944; 79:352–358.
- American Burn Association. *Advanced Burn Life Support (ABLS) Provider Manual.*
- National Network for Burn Care (UK). *National Burn Care Referral Guidance.*

## Verify

```sh
bin/test-form parkland-formula-for-burns
```
