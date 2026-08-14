# Sleep Study Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
sleep studies (polysomnography, home sleep apnoea testing, overnight oximetry).
These sources anchor the four-axis interpretation grade, the AHI severity bands,
and the critical-result alerting rules used by this form.

## Severity bands and scoring

### AASM apnoea-hypopnoea index (AHI) severity

The American Academy of Sleep Medicine (AASM) standardizes the scoring of
respiratory events and the AHI severity thresholds that the form's `osa_severity`
field and the grade's `reporting_category` label use. For adults and adolescents
aged 13 and over:

| AHI (events/hour) | Severity band |
| --- | --- |
| < 5 | Normal / none |
| 5 to < 15 | Mild OSA |
| 15 to < 30 | Moderate OSA |
| ≥ 30 | Severe OSA |

Interpretation always considers the clinical context — symptoms, comorbidities,
oxygen desaturation (ODI, minimum SpO2, T90), and arousal indices — not the AHI
in isolation. The Oxygen Desaturation Index (ODI), nadir SpO2
(`minimum_spo2_percent`), and the percentage of time below 90% saturation
(`time_below_90_percent_spo2`, T90) quantify the desaturation burden that drives
the `significant_desaturation` finding and the critical-result alert.

Sources:

- AASM scoring of respiratory events and AHI severity classification (mild /
  moderate / severe). <https://aasm.org/clinical-resources/scoring-manual/>
- Understanding your apnea-hypopnea index (AHI), Mayo Clinic Press.
  <https://mcpress.mayoclinic.org/sleep-apnea/understanding-your-apnea-hypopnea-index-ahi/>
- Pitfalls of the AHI system of severity grading in obstructive sleep apnoea
  (why context matters beyond the index).
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8889969/>

## Diagnosis, management, and follow-up

### NICE NG202

NICE NG202 *Obstructive sleep apnoea/hypopnoea syndrome and obesity
hypoventilation syndrome in over 16s* covers OSAHS, obesity hypoventilation
syndrome (OHS), and the COPD–OSAHS overlap. Relevant to this result form:

- **CPAP** is offered for OSAHS where symptoms affect quality of life and daytime
  activities; telemonitoring is recommended for up to 12 months. This maps to the
  form's `recommended_follow_up` field and the follow-up-urgency axis.
- **Nocturnal hypoventilation / OHS** may need non-invasive ventilation rather
  than CPAP — the `nocturnal_hypoventilation` finding escalates the follow-up to
  an urgent ventilation review.
- **Follow-up is in line with DVLA fitness-to-drive guidance**, including DVLA
  reporting.

Sources:

- NICE NG202 — Obstructive sleep apnoea/hypopnoea syndrome chapter.
  <https://www.nice.org.uk/guidance/ng202/chapter/1-Obstructive-sleep-apnoeahypopnoea-syndrome>
- NICE NG202 — full guideline.
  <https://www.nice.org.uk/guidance/ng202>

### DVLA fitness to drive (occupational-driver implications)

Severe OSA with excessive daytime sleepiness has direct driving implications. The
DVLA distinguishes OSA *without* excessive sleepiness from OSA *syndrome* (with
excessive sleepiness), which affects notification requirements, and vocational
(Group 2) drivers are held to a stricter standard. A severe-OSA result therefore
raises an occupational-driver implication recorded in the `recommended_follow_up`
and the `urgent-referral` / critical-result safety flags.

Sources:

- DVLA *Assessing fitness to drive* — excessive sleepiness / OSA syndrome and
  driving. <https://www.gov.uk/guidance/neurological-disorders-assessing-fitness-to-drive>
- Sleep Apnoea Trust — detailed DVLA guidance for UK drivers with sleep apnoea.
  <https://sleep-apnoea-trust.org/driving-and-sleep-apnoea/detailed-guidance-to-uk-drivers-with-sleep-apnoea/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| AASM AHI severity thresholds | `apnoea_hypopnoea_index`, `osa_severity`, `reporting_category` (Axis B) |
| AASM desaturation metrics | `oxygen_desaturation_index`, `minimum_spo2_percent`, `time_below_90_percent_spo2`, `significant_desaturation` |
| NICE NG202 CPAP / ventilation pathway | `recommended_follow_up`, follow-up-urgency axis |
| NICE NG202 OHS / hypoventilation | `nocturnal_hypoventilation`, critical-result alert |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
| DVLA fitness to drive | occupational-driver implications in `recommended_follow_up`, `urgent-referral` flag |
