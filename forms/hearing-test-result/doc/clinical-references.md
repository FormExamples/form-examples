# Hearing Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
audiological (hearing) examinations. These sources anchor the four-axis
interpretation grade, the hearing-loss severity descriptors, and the
critical-result alerting rules used by this form.

## Hearing-loss severity descriptors

### British Society of Audiology (BSA) audiometric descriptors

The BSA *Recommended Procedure: Pure-tone air-conduction and bone-conduction
threshold audiometry* defines the audiometric descriptors used to grade hearing
loss from the pure-tone average (PTA, dB HL), taken across the standard
frequencies. Where no response is obtained at a frequency, that reading is given
a value of 130 dB HL for the purpose of the average.

| Descriptor | Pure-tone average (dB HL) |
| --- | --- |
| Normal | ≤ 20 |
| Mild | 21–40 |
| Moderate | 41–70 |
| Severe | 71–95 |
| Profound | > 95 |

The form additionally offers a *moderately-severe* descriptor (commonly used
clinically within the moderate–severe range) so the per-ear severity matches the
descriptor terminology in routine audiology reports. These descriptors map to
the `hearing_loss_severity_right` / `hearing_loss_severity_left` fields and feed
the abnormality-severity axis.

Sources:

- BSA Recommended Procedure: Pure-tone air-conduction and bone-conduction
  threshold audiometry (2018).
  <https://www.thebsa.org.uk/wp-content/uploads/2024/01/Recommended-Procedure-Pure-Tone-Audiometry-2018.pdf>
- BATOD — Describing deafness (audiometric descriptors overview).
  <https://www.batod.org.uk/resource/2-1-describing-deafness/>

## Reporting standards and assessment

### NICE NG98 — Hearing loss in adults

NICE NG98 covers assessment and management of hearing loss in adults, including
referral pathways and the interpretation of audiometric findings. It underpins
the form's interpretation and recommended-follow-up content.

- NICE NG98 *Hearing loss in adults: assessment and management*.
  <https://www.nice.org.uk/guidance/ng98>

## Critical-result alerting

### Sudden sensorineural hearing loss (otological emergency)

Sudden sensorineural hearing loss (SSNHL) is an **otological emergency**: per
NICE and ENT-UK / BAO-HNS guidance, hearing loss developing over a short period
within the past 30 days needs immediate specialist assessment (within 24 hours);
loss developing more than 30 days ago should be referred urgently (within 2
weeks). Timely steroid treatment is time-critical. This drives the
`sudden_sensorineural_loss` structured flag, the `sudden-sensorineural-loss`
safety-flag category, and the automatic `critical-result-alert`.

- NICE QS185 *Hearing loss in adults*, quality statement 2 (sudden onset).
  <https://www.nice.org.uk/guidance/qs185/chapter/quality-statement-2-sudden-onset-of-hearing-loss>
- *Sudden sensorineural hearing loss and bedside phone testing: a guide for
  primary care*, British Journal of General Practice 2020.
  <https://bjgp.org/content/70/692/144>
- AAO-HNS *Clinical Practice Guideline: Sudden Hearing Loss (Update)* (2019).
  <https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/10.1177/0194599819859885>

### Marked asymmetry — retrocochlear pathology

A marked asymmetry between ears warrants investigation to exclude a
retrocochlear lesion such as a vestibular schwannoma; MRI of the internal
auditory meatus (IAM) is the imaging modality of choice. This drives the
`asymmetric_loss` structured flag, the `asymmetric-loss-retrocochlear`
safety-flag category, and an urgent / critical follow-up recommendation.

- ENT-UK / BAO-HNS sudden sensorineural hearing loss and asymmetry guidance.
  <https://www.entuk.org/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| BSA audiometric descriptors | `hearing_loss_severity_{right,left}`, severity axis, `reporting_category` |
| BSA pure-tone average | `pure_tone_average_{right,left}_db` |
| NICE NG98 assessment / referral | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| SSNHL otological emergency | `sudden_sensorineural_loss`, `sudden-sensorineural-loss` flag, `critical-result-alert` |
| Asymmetry / retrocochlear | `asymmetric_loss`, `asymmetric-loss-retrocochlear` flag |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| Mandatory report sections | report-completeness axis (`report_completeness_percent`) |
