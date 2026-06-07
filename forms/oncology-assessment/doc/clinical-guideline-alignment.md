# Clinical Guideline Alignment

The oncology assessment uses ECOG performance status as the primary
scored instrument and captures a structured cancer history, current
treatment, symptom and toxicity profile, and psychosocial / functional
review. The following authoritative sources informed the field set and
rule catalogue.

## NICE oncology guidance

NICE publishes cancer-specific guidelines, technology appraisals, and
quality standards. Live index:
https://www.nice.org.uk/guidance/conditions-and-diseases/cancer

Examples of guidelines this assessment is compatible with:

- NG12 *Suspected cancer: recognition and referral.*
  https://www.nice.org.uk/guidance/ng12
- QS167 *Cancer services for children and young people.*
  https://www.nice.org.uk/guidance/qs55
- The full set of NICE Technology Appraisals (TAs) for specific
  cancer-drug eligibility decisions. ECOG is a recurring eligibility
  criterion in these TAs.

## NCCN (National Comprehensive Cancer Network)

NCCN publishes the most widely referenced tumour-specific guidelines in
the US, freely available after registration. Index:
https://www.nccn.org/guidelines/category_1

NCCN guidelines universally use ECOG (or KPS) as the performance-status
input to treatment-pathway selection.

## ESMO (European Society for Medical Oncology)

ESMO clinical practice guidelines:
https://www.esmo.org/guidelines

ESMO guidelines pair ECOG with comorbidity indices (e.g. CCI, G8 for
geriatric oncology) for treatment-intent decisions. This assessment
captures CCI-relevant comorbidities on Step 8 but does not auto-compute
a CCI score.

## CTCAE for toxicity grading

- National Cancer Institute *Common Terminology Criteria for Adverse
  Events (CTCAE) v5.0.* 2017. https://ctep.cancer.gov/protocolDevelopment/electronic_applications/ctc.htm

## UK national audits

This assessment is compatible with the structured data items collected
by NHS Digital cancer audits:

- National Cancer Patient Experience Survey.
  https://www.ncpes.co.uk
- National Cancer Registration and Analysis Service (NCRAS) datasets.
  https://digital.nhs.uk/ndrs

## What this engine does NOT compute

- We do not compute the Charlson Comorbidity Index (CCI). The CCI
  requires a weighted look-up of 19 conditions and is not implemented
  here to avoid drift from the canonical Charlson 1987 weighting.
- We do not compute the G8 geriatric screening tool.
- We do not compute the PG-SGA (Patient-Generated Subjective Global
  Assessment) for nutrition — the nutrition field on Step 10 is a
  simplified intake screen.
- We do not assign TNM (Tumour, Node, Metastasis) staging — the cancer
  diagnosis fields on Step 2 record clinician-supplied staging verbatim.
- We do not recommend specific systemic therapy regimens.

## Pain assessment

Pain on Step 5 uses the 11-point Numeric Rating Scale (NRS) (0 = no pain,
10 = worst imaginable pain), the most widely validated pain instrument
in oncology (Jensen MP et al.).

## Patient self-report caveats

This form may be used as a clinic-room PROM (patient-reported outcome
measure) tool. ECOG, however, is a clinician-rated instrument and the
final ECOG grade in the FHIR Bundle and PDF report must be confirmed by
the responsible clinician before being used in any treatment decision.
