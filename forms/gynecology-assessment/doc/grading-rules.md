# Grading rules

The gynecology-assessment form is a symptom-led intake questionnaire. There
is no single canonical "gynaecology symptom severity score" used universally
across UK practice; the form therefore takes a composite approach grounded
in symptom-specific NICE guidance and produces three severity bands per
symptom cluster (menstrual, pelvic pain, urogynaecological, sexual health).

The output is intended to support triage and referral decisions, not to
make a diagnosis.

## Symptom-specific grading components

### Menstrual bleeding

Heavy menstrual bleeding (HMB) severity follows NICE NG88 (March 2018,
updated 2021). The HMB working definition from NG88 is patient-reported
heavy bleeding affecting physical, social, emotional or material quality
of life.

- Source: NICE NG88 — *Heavy menstrual bleeding: assessment and management*.
  <https://www.nice.org.uk/guidance/ng88>

The form records flooding, clotting, sanitary product change frequency, and
the validated HMB impact question from NG88 §1.1.

### Pelvic pain

Pelvic pain severity follows the NRS pain scale (0–10) supplemented by
NICE NG73 (endometriosis) symptom questions for cyclical pain. See the
separate endometriosis-assessment form for full grading.

- NICE NG73 — *Endometriosis: diagnosis and management*:
  <https://www.nice.org.uk/guidance/ng73>

### Postmenopausal bleeding

The form treats any patient-reported postmenopausal bleeding (≥ 12 months
after final menstrual period) as an automatic "two-week wait" red-flag
referral, following NICE NG12 §1.5 *Suspected cancer: recognition and
referral*.

- NICE NG12 — *Suspected cancer: recognition and referral*:
  <https://www.nice.org.uk/guidance/ng12>

### Cervical screening

Follows NHS Cervical Screening Programme guidance. The form records the
patient's last screening date and outcome; an overdue screen triggers a
flagged issue. NHS programme page:
<https://www.gov.uk/government/collections/cervical-screening-management-of-the-screening-programme>

### Pelvic organ prolapse

The form uses patient-reported prolapse symptoms (vaginal bulge, pelvic
heaviness, dragging sensation, splinting for defaecation) per NICE NG123
(*Urinary incontinence and pelvic organ prolapse in women*):
<https://www.nice.org.uk/guidance/ng123>

Formal prolapse staging (POP-Q) is a clinician-performed examination and is
not asked of the patient.

### Sexual health

Sexual symptom screening follows BASHH (British Association for Sexual
Health and HIV) guidance for routine symptom screening:
<https://www.bashh.org/guidelines/>

## Three-level severity bands

The composite engine produces a per-domain severity band:

| Band | Trigger |
| ---- | ------- |
| Mild | Symptoms present but no NICE NG12 / urgent-referral feature; quality of life not significantly affected |
| Moderate | Symptoms present and significantly affecting daily life or persisting > 3 months |
| Severe | Any NICE NG12 red flag (postmenopausal bleeding, persistent IMB > 4 weeks in women 45+, suspected ovarian mass, suspected vulval cancer) — triggers two-week-wait referral |

## Red flags

- Postmenopausal bleeding
- Intermenstrual bleeding persisting > 4 weeks in women aged 45+
- Postcoital bleeding persisting > 4 weeks
- Pelvic or abdominal mass not clearly uterine fibroid
- Vulval lesion or persistent vulval pruritus with examination findings
- Ascites in any patient
- Persistent bloating > 12 days/month in women 50+
- Unexplained weight loss with pelvic symptoms

Each of these triggers a 2-week-wait suspected-cancer referral
recommendation per NICE NG12.

## Notes

- The form does not implement POP-Q (Pelvic Organ Prolapse Quantification)
  or any clinician-examination scoring system.
- The form does not perform colposcopy interpretation.
- Pregnancy-related bleeding is routed to the obstetrics / prenatal
  assessment forms.
