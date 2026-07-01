# Bowel Cancer Screening with Faecal Immunochemical Test (FIT)

A documentation and result-classification form for the **NHS Bowel Cancer
Screening Programme (BCSP)**. It records the outcome of a home **faecal
immunochemical test (FIT)** kit: the participant's screening eligibility, whether
the kit was returned and adequate, and the measured **faecal haemoglobin
concentration** in **micrograms of haemoglobin per gram of faeces (µg Hb/g)**. A
result-classification engine compares the concentration against the programme
threshold, assigns a **result class** (negative / positive / spoilt), sets the
**management action** (routine recall / colonoscopy referral / repeat kit),
validates completeness, and raises flagged issues.

FIT is a quantitative immunoassay that detects human haemoglobin in stool. In
the population screening programme it replaced the guaiac faecal occult blood
test (gFOBt). The BCSP invites eligible adults on a **two-yearly recall** and
uses a programme threshold of **≥ 120 µg Hb/g** to define a positive screen and
trigger colonoscopy referral. This is deliberately higher than the symptomatic
threshold: **NICE DG56** recommends FIT at **≥ 10 µg Hb/g** to guide urgent
referral for people with symptoms of possible colorectal cancer. This form is a
**screening** instrument, but records a symptomatic flag so that any participant
who reports red-flag symptoms is routed to the suspected-cancer pathway
regardless of the numeric FIT result.

## Scope and intended users

- **Setting:** NHS bowel cancer screening hubs and screening centres, and
  general practice where FIT results are reviewed and acted upon.
- **Users:** screening-hub administrators and clinicians, screening
  practitioners, GPs, and specialist screening practitioners (SSPs) who counsel
  participants and arrange onward referral.
- **Participants:** adults within the programme age range on routine two-yearly
  recall. The programme has been extending its lower age boundary from 60 toward
  **50**; the fully rolled-out range is approximately **50–74** (historically
  54–74 or 60–74 during phased rollout). Adults over the upper age can request a
  kit on demand.
- **Not for:** diagnosis of colorectal cancer (that requires colonoscopy or
  equivalent), symptomatic diagnostic FIT triage as the primary purpose (use the
  NICE DG56 symptomatic pathway; this form records but does not replace it), or
  paediatric use.

## Data captured & result-classification model

The form captures four groups of data and derives a result classification.

**1. Eligibility and invitation.**

| Field | Notes |
| --- | --- |
| Participant age | against the programme range (~50/54–74) |
| Within screening age range | eligible / over-age self-request / not eligible |
| Recall interval | two-yearly routine recall |
| Invitation / kit sent date | when the FIT kit was issued |
| Previous screening outcome | prior negative / positive / first invitation / unknown |

**2. Kit return and adequacy.**

| Field | Notes |
| --- | --- |
| Kit returned | yes / no |
| Return date | date the sample was received at the hub |
| Sample adequate | adequate / spoilt / insufficient / expired |
| Spoilt reason | leaked / undated / unlabelled / too old / damaged |

**3. FIT result.**

| Field | Notes |
| --- | --- |
| Faecal haemoglobin concentration | numeric, **µg Hb/g faeces** |
| Assay / analyser | free text |
| Programme threshold applied | numeric, default **120 µg Hb/g** |

**4. Symptoms and outcome.**

| Field | Notes |
| --- | --- |
| Reported red-flag symptoms | yes / no (bleeding, weight loss, change in bowel habit, anaemia) |
| Result class | derived: negative / positive / spoilt |
| Management action | derived: routine recall / colonoscopy referral / repeat kit |

**Result-classification algorithm.** Applied in priority order:

1. **Kit not returned** → management action **repeat kit / reminder**; raise a
   non-return flag (no numeric result to classify).
2. **Sample not adequate** (spoilt / insufficient / expired) → result **spoilt**;
   management action **repeat kit**.
3. **Faecal Hb ≥ threshold** (default 120 µg Hb/g) → result **positive**;
   management action **refer for colonoscopy**.
4. **Faecal Hb < threshold** → result **negative**; management action **routine
   two-yearly recall**.

Independently of the numeric result, **reported red-flag symptoms** route the
participant to the **suspected-cancer pathway** (urgent referral) regardless of
whether FIT is negative — a negative screening FIT does not exclude cancer in a
symptomatic person.

**Screening vs symptomatic threshold.** The programme (screening) threshold is
**≥ 120 µg Hb/g**. The symptomatic threshold under **NICE DG56** is
**≥ 10 µg Hb/g**. The threshold is a stored field (default 120) so the same
engine can be configured for either context, but this form's primary purpose is
population screening at 120.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | reviewing clinician / administrator name and role, hub / centre, review date |
| 2 | Participant identification | participant identifier, NHS number, age, sex |
| 3 | Eligibility and invitation | within age range, recall interval, invitation date, previous outcome |
| 4 | Kit return and adequacy | kit returned, return date, sample adequacy, spoilt reason |
| 5 | FIT result | faecal Hb concentration (µg Hb/g), assay, threshold applied |
| 6 | Symptoms | reported red-flag symptoms |
| 7 | Summary and outcome | derived result class, management action, flagged issues, free-text note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — screening
  result-documentation and decision-support tool; the output records a
  classification and prompts a pathway action rather than delivering a diagnosis.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Public Health England / NHS England. *Bowel Cancer Screening Programme:
  guidance and FIT operational standards.*
- NICE **DG56**. *Quantitative faecal immunochemical testing to guide colorectal
  cancer pathway referral in primary care* (symptomatic threshold ≥ 10 µg Hb/g).
- NICE **NG151**. *Colorectal cancer* (2020, updated).
- NHS Bowel Cancer Screening Programme age-extension and threshold operational
  standards.

## Verify

```sh
bin/test-form bowel-cancer-screening-with-faecal-immunochemical-test
```
