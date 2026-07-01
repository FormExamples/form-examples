# Zarit Burden Interview (ZBI)

A caregiver self-report questionnaire that measures the subjective **burden**
experienced by an informal carer looking after a person with dementia, chronic
illness, or long-term disability. The carer rates **22 items** describing the
emotional, physical, social, and financial strain of caregiving, each on a
**0–4** frequency scale (0 = never … 4 = nearly always). The item ratings sum to
a total of **0–88**, which is mapped to a burden band from *little or no burden*
to *severe burden*. A high total is a prompt to arrange **carer support and
respite** and to **screen the carer for depression and anxiety**.

The ZBI was introduced by Zarit, Reeves and Bach-Peterson (*The Gerontologist*,
1980) and has become the most widely used measure of caregiver burden. A
validated **12-item short form (ZBI-12)** with a total of **0–48** is also
supported for briefer screening. The instrument measures the carer's own
perceived strain; it is not a diagnosis of the carer and it does not assess the
clinical condition of the care recipient.

## Scope and intended users

- **Setting:** old-age and memory services, community and district nursing,
  general practice, social care and carer-support services, palliative and
  long-term-condition teams — any setting supporting an informal (unpaid) carer.
- **Users:** the **carer** completes the item ratings (as a self-report or in a
  structured interview); a clinician, social-care practitioner, or carer-support
  worker administers the instrument, records context, and acts on the result.
- **Subject:** the informal carer of a person with dementia, chronic illness, or
  disability. Each record concerns **one carer–recipient pair**.
- **Not for:** diagnosing the carer, assessing the care recipient's condition or
  care needs, or determining eligibility for services on its own. A low score
  does not mean no support is needed; clinical judgement always applies.

## Scoring system

**Primary instrument:** ZBI-22 — 22 items, each rated on the same 0–4 frequency
scale. Items are summed to a total of **0–88**. Higher totals indicate greater
perceived burden.

**Response scale (every item).**

| Rating | Label |
| --- | --- |
| 0 | Never |
| 1 | Rarely |
| 2 | Sometimes |
| 3 | Quite frequently |
| 4 | Nearly always |

**Items (abridged wording).** Each begins *"Do you feel…"* or *"Are you…"* and
covers a facet of caregiving strain: not enough time for oneself, stress between
caregiving and other responsibilities, anger around the relative, strained
relationships with others, worry about the future, dependence of the relative,
loss of privacy and social life, financial strain, loss of control, and overall
burden. Item 22 is a global question — *"Overall, how burdened do you feel?"*.
The full 22-item wording is reproduced in [`doc/`](doc).

**Interpretation (ZBI-22 total 0–88).**

| Total score | Burden band | Recommended action |
| --- | --- | --- |
| 0–21 | Little or no burden | Reassure and review; re-administer if circumstances change. |
| 22–40 | Mild to moderate burden | Offer carer information and support; signpost respite and peer support; plan review. |
| 41–60 | Moderate to severe burden | Arrange carer-support assessment and respite; screen for depression and anxiety; review the care package. |
| 61–88 | Severe burden | Urgent carer-support and respite planning; screen and refer for carer mental-health support; consider risk to the caring arrangement. |

The commonly cited band boundaries above are applied with disjoint ranges in the
scoring engine (see [`spec/index.md`](spec/index.md) §4). Higher burden bands,
and the global item 22, are the primary triggers for the flagged issues.

**Short form (ZBI-12).** The validated 12-item short form uses the same 0–4
scale and sums to a total of **0–48**. A commonly used cut-off of **≥ 17**
indicates high burden warranting support and mental-health screening. The engine
supports the short form as a scoring mode over the corresponding 12 items; see
[`spec/index.md`](spec/index.md) §4.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | administering practitioner name and role, date and time, care setting, instrument form (ZBI-22 or ZBI-12) |
| 2 | Carer details | carer identifier, relationship to the care recipient, whether co-resident, hours of care per week |
| 3 | Care recipient details | recipient identifier, primary condition (dementia / chronic illness / disability / other) |
| 4 | Burden items | the 22 (or 12) item ratings, each 0–4 on the frequency scale |
| 5 | Summary and score | computed total, burden band, fired items, red-flag issues, recommended actions, free-text note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support screening tool; the output prompts carer support and
  mental-health screening rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Zarit S.H., Reeves K.E., Bach-Peterson J. Relatives of the impaired elderly:
  correlates of feelings of burden. *The Gerontologist* 1980; 20(6):649–655.
- Bédard M. *et al.* The Zarit Burden Interview: a new short version and
  screening version. *The Gerontologist* 2001; 41(5):652–657.
- Hébert R. *et al.* Reliability, validity and reference values of the Zarit
  Burden Interview. *Canadian Journal on Aging* 2000; 19(4):494–507.
- NICE NG97. *Dementia: assessment, management and support for people living with
  dementia and their carers* (2018).

## Verify

```sh
bin/test-form zarit-burden-interview
```
