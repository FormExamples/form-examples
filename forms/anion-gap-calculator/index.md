# Anion Gap Calculator

A point-of-care calculator that derives the **serum anion gap** from a routine
electrolyte panel, corrects it for the patient's serum albumin, and classifies
the result as **low**, **normal**, or **high**. A high anion gap is the key
laboratory signature of a **high anion gap metabolic acidosis (HAGMA)** and
prompts a structured search for the underlying cause. The calculator does not
diagnose; it turns four or five numbers into a computed gap, a corrected gap, a
classification band, and a set of flagged issues that direct further
investigation.

The anion gap estimates the difference between the routinely measured serum
cations and anions. Because unmeasured anions (for example lactate, ketoacids,
and other organic or toxic acids) raise the gap, a rising anion gap is a
sensitive early marker of accumulating acid. Serum albumin is itself a major
unmeasured anion, so a low albumin lowers the apparent gap and can mask a true
acidosis; the **albumin-corrected anion gap** restores the sensitivity that
hypoalbuminaemia would otherwise erode.

## Scope and intended users

- **Setting:** emergency department, acute and general medical wards, intensive
  care, high-dependency and resuscitation areas, and clinical biochemistry /
  laboratory reporting — anywhere a serum electrolyte panel is interpreted at
  the point of care.
- **Users:** doctors, advanced nurse practitioners, critical-care and emergency
  clinicians, clinical scientists, and pharmacists reviewing acid–base status.
- **Patients:** adults with a measured serum electrolyte panel (sodium,
  chloride, bicarbonate; potassium and albumin optional).
- **Not for:** definitive diagnosis of the cause of an acidosis, arterial
  blood-gas interpretation on its own, paediatric reference ranges, or as a
  substitute for clinical judgement. A normal anion gap does not exclude a
  metabolic acidosis (a normal / hyperchloraemic acidosis has a normal gap).

## Calculation and interpretation

### Anion gap

Two formulae are supported. The **potassium-inclusive** form is used when a
serum potassium is entered; otherwise the **potassium-exclusive** form is used.
All electrolytes are in **mmol/L**.

```
With potassium:     anionGap = (sodium + potassium) − (chloride + bicarbonate)
Without potassium:  anionGap =  sodium              − (chloride + bicarbonate)
```

Sodium, chloride, and bicarbonate are **required**; potassium and albumin are
**optional**.

### Albumin-corrected anion gap

Serum albumin is a major unmeasured anion. Roughly **2.5 mmol/L** of anion gap
is lost for every **10 g/L** fall in albumin below the reference of **40 g/L**,
so the correction adds it back:

```
correctedAnionGap = anionGap + 0.25 × (40 − albumin)          // albumin in g/L
```

The corrected gap is only computed when a serum albumin is entered. When
albumin is normal (≈ 40 g/L) the correction is negligible; when albumin is low
the corrected gap can be substantially higher than the raw gap.

### Normal ranges and classification

The reference range depends on whether potassium was included:

| Formula | Normal anion gap |
| --- | --- |
| With potassium `(Na + K) − (Cl + HCO₃)` | ~ **8–16 mmol/L** |
| Without potassium `Na − (Cl + HCO₃)` | ~ **8–12 mmol/L** |

Classification uses the **corrected** anion gap when an albumin is available,
otherwise the raw anion gap:

| Band | Condition | Interpretation |
| --- | --- | --- |
| Low | below the normal lower bound | Consider hypoalbuminaemia (if uncorrected), laboratory error, paraproteinaemia, lithium or bromide, or severe hypercalcaemia / hypermagnesaemia. |
| Normal | within the normal range | Anion gap not raised. Does **not** exclude a normal-gap (hyperchloraemic) metabolic acidosis. |
| High | above the normal upper bound | Suggests a high anion gap metabolic acidosis — investigate the cause (see differential). |
| Very high | at or above **20 mmol/L** | Marked elevation; treat as urgent and seek the cause of the acidosis without delay. |

### High anion gap differential

A raised gap should trigger a structured search for unmeasured anions. Two
common mnemonics:

- **GOLDMARK** — **G**lycols (ethylene, propylene), **O**xoproline (5-oxoproline,
  chronic paracetamol), **L**-lactate, **D**-lactate, **M**ethanol,
  **A**spirin (salicylate), **R**enal failure (uraemia), **K**etoacidosis
  (diabetic, alcoholic, starvation).
- **MUDPILES** — **M**ethanol, **U**raemia, **D**iabetic ketoacidosis,
  **P**ropylene glycol / paraldehyde, **I**ron / **I**soniazid, **L**actic
  acidosis, **E**thylene glycol, **S**alicylates.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of calculation, care setting, clinical context / indication |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Electrolytes | serum sodium, chloride, bicarbonate (required); serum potassium (optional) |
| 4 | Albumin | serum albumin g/L (optional; enables albumin correction) |
| 5 | Result and interpretation | computed anion gap, albumin-corrected anion gap, classification band, flagged issues, differential prompt, free-text clinical note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support calculator; the output prompts investigation rather than
  determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Kraut J.A., Madias N.E. Serum anion gap: its uses and limitations in clinical
  medicine. *Clin J Am Soc Nephrol* 2007; 2(1):162–174.
- Emmett M., Narins R.G. Clinical use of the anion gap. *Medicine (Baltimore)*
  1977; 56(1):38–54.
- Figge J. *et al.* Anion gap and hypoalbuminemia. *Crit Care Med* 1998;
  26(11):1807–1810.
- Mehta A.N. *et al.* GOLD MARK: an anion gap mnemonic for the 21st century.
  *Lancet* 2008; 372(9642):892.

## Verify

```sh
bin/test-form anion-gap-calculator
```
