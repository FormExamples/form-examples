# Electroencephalogram Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
electroencephalogram (EEG) recordings. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Recording and reporting standards

### IFCN / ILAE minimum standards for routine and sleep EEG

A joint working group of the International Federation of Clinical
Neurophysiology (IFCN) and the International League Against Epilepsy (ILAE)
developed minimum standards for recording routine and sleep EEG (Peltola et
al., *Epilepsia*, 2023). The standards cover acquisition (digital sampling rate,
filters, channel count), the 10–20 / 25-electrode montage, activation
procedures (hyperventilation, intermittent photic stimulation), and the
documentation that the recording and report must contain.

Key principles relevant to this form:

- **Technique and quality** — the recording's technical adequacy must be
  documented. This maps to `recording_quality` and `recording_duration_minutes`
  and the `inadequate-technique` safety flag.
- **Activation procedures** — photic stimulation may elicit a photoparoxysmal
  response, captured by the `photoparoxysmal_response` structured finding.
- **Structured report sections** — clinical history, technique, comparison,
  findings (background and abnormalities), and an interpretation/impression. The
  report-completeness axis scores presence of these mandatory sections.

Sources:

- Routine and sleep EEG: minimum recording standards of the IFCN and the ILAE —
  Peltola et al., *Epilepsia*, 2023.
  <https://onlinelibrary.wiley.com/doi/abs/10.1111/epi.17448>
- Joint ILAE and IFCN minimum standards for recording routine and sleep EEG (PDF).
  <https://www.ilae.org/files/dmfile/eeg-minimum-standards.pdf>
- ILAE — minimum standards for long-term video-EEG monitoring.
  <https://www.ilae.org/guidelines/guidelines-and-reports/proposed-guideline-minimum-standards-for-long-term-video-eeg-monitoring>

## Structured reporting and terminology

### SCORE — Standardised Computer-based Organised Reporting of EEG

Interobserver agreement in EEG interpretation is only moderate, partly because
findings are commonly reported in free-text format. The SCORE framework lets the
reporter construct the report by choosing from predefined elements for each
relevant EEG feature (background activity, epileptiform discharges, seizures,
provoked patterns), improving consistency and inter-rater reliability. SCORE
category labels are an example of the value the form stores in the grade's
`reporting_category` field.

- Standardized Computer-based Organized Reporting of EEG (SCORE), *Clinical
  Neurophysiology*. <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3759702/>

### ACNS Standardized Critical Care EEG Terminology

The American Clinical Neurophysiology Society (ACNS) standardized critical-care
EEG terminology (2021 version) characterizes background activity as well as
rhythmic and periodic patterns in encephalopathic and critically ill patients,
maximizing inter-rater reliability and supporting recognition of non-convulsive
seizures and non-convulsive status epilepticus. It underpins the
`background_rhythm` grading and the `status_epilepticus` / `seizure_recorded`
critical findings.

- American Clinical Neurophysiology Society's Standardized Critical Care EEG
  Terminology: 2021 Version, *J Clin Neurophysiol*.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC8135051/>

## Critical-result context (carried from the request)

- NICE NG217 *Epilepsies in children, young people and adults* — an EEG
  **supports** a diagnosis of epilepsy and helps classify seizure type /
  syndrome; status epilepticus is a neurological emergency.
  <https://www.nice.org.uk/guidance/ng217>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| IFCN/ILAE structured report sections | report-completeness axis (`report_completeness_percent`) |
| IFCN/ILAE technical adequacy | `recording_quality`, `recording_duration_minutes`, `inadequate-technique` flag |
| IFCN/ILAE photic activation | `photoparoxysmal_response` |
| SCORE structured reporting | `reporting_category` (Axis B) |
| ACNS critical-care terminology | `background_rhythm`, `status_epilepticus`, `seizure_recorded`, `critical-result-alert` flag |
| Critical-finding communication | `critical_result_communicated`, `reported_to`, `critical-result-alert` flag |
