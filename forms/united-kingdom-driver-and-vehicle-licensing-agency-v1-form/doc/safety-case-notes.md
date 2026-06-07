# Safety-case notes — DVLA V1 implementation

The V1 form is a structured data-capture instrument replicating the paper
DVLA V1 questionnaire used by ophthalmic clinicians. It is not a vision-
testing device.

## Intended use

- Collect a structured visual-function record (acuity, fields, diplopia,
  pathology) equivalent to the paper DVLA V1.
- Produce a clinician-readable summary that maps to the DVLA "Assessing
  fitness to drive" Visual disorders chapter standards.
- Persist the dataset for transmission to DVLA Drivers Medical Group.

It is **not** intended to:

- Perform automated visual acuity or field testing.
- Make automated fitness-to-drive determinations.
- Substitute for measurement on a calibrated Snellen chart, logMAR chart,
  or Humphrey Field Analyzer.

## Regulatory classification

Under MDCG 2019-11 Rev.1 and UK Medical Devices Regulations 2002
(SI 2002/618):

- Faithful data-capture of an authority questionnaire, without an
  embedded vision test or an automated clinical recommendation, is
  generally outside the medical-device definition.
- An embedded vision test (e.g. screen-based acuity check) would be
  Class IIa under MDR Rule 11. The current implementation does not
  embed any vision test.

## Hazard log (selection)

1. **Self-reported acuity entered as measured acuity** — every acuity
   field requires the clinician to record the chart used (Snellen
   distance / logMAR / Sloan), method, and date of measurement.
2. **Esterman plot attachment missing for borderline field** — when a
   field defect is recorded but no plot is attached, the form raises a
   blocking validation flag.
3. **Number-plate test substituted for clinical acuity** — explicit
   separate fields; cannot collapse.
4. **Identity confusion** — driver number (DVLA format) plus NHS number
   plus date of birth captured at submission.

## Standards referenced

- Snellen chart acuity standards (Snellen H., 1862; current ISO 8596:
  2017 — Ophthalmic optics — Visual acuity testing —
  <https://www.iso.org/standard/69042.html>).
- Esterman B. (1982) — Functional scoring of the binocular field.
  *Ophthalmology* 89(11): 1226–34. PMID 7155532.

## Governance

- UK MHRA — Software and AI as a medical device:
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- DCB0129 / DCB0160 NHS clinical safety standards:
  <https://digital.nhs.uk/services/clinical-safety>
- ISO 14971:2019 — Application of risk management to medical devices.
