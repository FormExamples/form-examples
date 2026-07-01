# Ottawa Ankle Rules (and Ottawa Foot Rules)

A validated clinical decision rule that decides whether an **ankle X-ray** or a
**foot X-ray** is needed after an acute ankle or midfoot injury. It records a
small set of objective bedside findings — the site of pain, bone tenderness at
four specific landmarks, and the ability to bear weight — and applies a boolean
decision algorithm to output, for each region, whether radiography is
**indicated** (yes/no). The rule is deliberately **highly sensitive**: it is
designed to miss virtually no clinically significant fracture while safely
reducing the number of unnecessary X-rays.

This is a **classification / decision-rule** instrument, not a numeric score.
There is no total to sum and no risk band; the outputs are two boolean imaging
decisions (ankle and foot) plus the criteria that drove them.

The Ottawa Ankle Rules were derived and validated by Stiell *et al.* (*Annals of
Emergency Medicine* 1992; *JAMA* 1993/1994) and are one of the most widely
adopted decision rules in emergency medicine.

## Scope and intended users

- **Setting:** emergency department (ED), minor-injury unit (MIU), urgent-care
  and walk-in centres — any setting assessing acute ankle or midfoot injury.
- **Users:** doctors, nurse practitioners, emergency nurse practitioners,
  physiotherapy practitioners, paramedics, and triage clinicians.
- **Patients:** adults (**≥ 18 years**) presenting within a recent window of an
  acute ankle or foot injury.
- **Not for:** definitive diagnosis (a negative rule reduces but does not
  formally exclude fracture), and to be applied with **caution in children**
  (paediatric validation exists but differs; local paediatric guidance takes
  precedence). The rule is also less reliable when assessment is unreliable —
  intoxication, distracting injury, diminished sensation, or gross swelling
  obscuring the landmarks.

## Scoring system

The rule is expressed as two independent boolean decisions, each combining a
**zone-of-pain** precondition (`AND`) with a set of **positive findings**
(`OR`). No points are summed.

### Ankle X-ray decision

An **ankle X-ray series is indicated** if there is **pain in the malleolar zone**
**AND any one** of the following:

| # | Positive finding |
| --- | --- |
| A1 | Bone tenderness at the **posterior edge or tip of the lateral malleolus** (distal 6 cm of the fibula) |
| A2 | Bone tenderness at the **posterior edge or tip of the medial malleolus** (distal 6 cm of the tibia) |
| A3 | **Inability to bear weight** — cannot take four steps (two on each foot) **both immediately after injury and** at assessment in the ED/MIU |

```
ankleXrayIndicated =
  malleolarZonePain
  AND ( lateralMalleolusTenderness
        OR medialMalleolusTenderness
        OR unableToBearWeight )
```

### Foot X-ray decision

A **foot X-ray series is indicated** if there is **pain in the midfoot zone**
**AND any one** of the following:

| # | Positive finding |
| --- | --- |
| F1 | Bone tenderness at the **base of the fifth metatarsal** |
| F2 | Bone tenderness at the **navicular** |
| F3 | **Inability to bear weight** — cannot take four steps both immediately and at assessment |

```
footXrayIndicated =
  midfootZonePain
  AND ( fifthMetatarsalBaseTenderness
        OR navicularTenderness
        OR unableToBearWeight )
```

### Interpretation

| Output | Meaning | Recommended action |
| --- | --- | --- |
| Ankle X-ray **indicated** | Malleolar-zone criteria met | Request an ankle radiograph series. |
| Ankle X-ray **not indicated** | Criteria not met | Clinically significant ankle fracture unlikely; manage as soft-tissue injury, safety-net, and review if not improving. |
| Foot X-ray **indicated** | Midfoot-zone criteria met | Request a foot radiograph series. |
| Foot X-ray **not indicated** | Criteria not met | Clinically significant midfoot fracture unlikely; manage conservatively and safety-net. |

The two decisions are independent: a patient may need an ankle series, a foot
series, both, or neither. The "unable to bear weight" finding contributes to
**both** regions.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective bedside finding**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, injured side (left/right), time since injury |
| 2 | Patient identification | patient identifier, age (with ≥ 18 applicability check), sex |
| 3 | Applicability | age ≥ 18; assessment reliable (no intoxication, distracting injury, or sensory deficit) — flags caution if not met |
| 4 | Pain zones | malleolar-zone pain (yes/no), midfoot-zone pain (yes/no) |
| 5 | Ankle bone tenderness | lateral malleolus posterior edge/tip tenderness, medial malleolus posterior edge/tip tenderness |
| 6 | Foot bone tenderness | fifth-metatarsal-base tenderness, navicular tenderness |
| 7 | Weight-bearing | able to take four steps immediately after injury (yes/no), able to take four steps now at assessment (yes/no) → derives "unable to bear weight" |
| 8 | Summary and decision | computed ankle X-ray indicated (yes/no), foot X-ray indicated (yes/no), fired criteria, flagged issues, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- Boolean bedside findings are captured as `yes` / `no` enums (not free
  booleans) so "not yet answered" is distinguishable from `no`.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The decision engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support tool; the output recommends imaging rather than determining
  treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Stiell I.G. *et al.* A study to develop clinical decision rules for the use of
  radiography in acute ankle injuries. *Ann Emerg Med* 1992; 21(4):384–390.
- Stiell I.G. *et al.* Decision rules for the use of radiography in acute ankle
  injuries: refinement and prospective validation. *JAMA* 1993; 269(9):
  1127–1132.
- Stiell I.G. *et al.* Implementation of the Ottawa Ankle Rules. *JAMA* 1994;
  271(11):827–832.
- Bachmann L.M. *et al.* Accuracy of Ottawa ankle rules to exclude fractures of
  the ankle and mid-foot: systematic review. *BMJ* 2003; 326(7386):417.

## Verify

```sh
bin/test-form ottawa-ankle-rules
```
