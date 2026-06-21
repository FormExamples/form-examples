# Eye Vision Test Result — clinical references

Grounded reference material for the structured interpretation and reporting of
ophthalmic / optometric eye examinations. These sources anchor the four-axis
interpretation grade, the structured-reporting categories, and the
critical-result alerting rules used by this form.

## Reporting and acute-eye standards

### Royal College of Ophthalmologists (RCOphth)

RCOphth defines an **urgent** eye condition as any recent-onset condition that is
distressing or believed to present an imminent threat to vision or general
health, and an eye **emergency** as a condition that requires treatment or
admission at short notice to avoid damage to the eye or eyesight.

Sight-threatening emergencies relevant to this form include **central retinal
artery occlusion, acute angle-closure glaucoma, retinal detachment**, and
**giant cell arteritis (GCA)**. Central retinal artery occlusion presents with
sudden, severe, painless monocular visual loss and has the best prognosis when
treated early. These conditions, plus **proliferative diabetic retinopathy**,
drive the form's critical-result auto-escalation: Axis D becomes
`critical-alert`, the recommendation becomes `urgent-review` (urgent
ophthalmology), and the `critical-result-alert` flag is raised.

Key principles relevant to this form:

- **Actionable reporting** — a report should address the clinical question,
  highlight relevant findings, and offer guidance on further management. Maps to
  the `impression` and `recommended_follow_up` fields and the follow-up-urgency
  axis.
- **Structured sections** — clinical history, measurements, findings, and an
  impression/conclusion. The report-completeness axis scores presence of these
  mandatory sections.
- **Communication of critical, urgent, and unexpected significant findings** —
  the report records that such a finding was communicated and to whom; this
  drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` safety flag.

Source:

- Royal College of Ophthalmologists — clinical guidelines and acute-eye /
  emergency guidance. <https://www.rcophth.ac.uk/>

## Glaucoma and intraocular pressure

### NICE NG81 — Glaucoma: diagnosis and management

NICE NG81 recommends a single threshold of **24 mmHg** (using Goldmann-type
applanation tonometry) for both onward referral and treatment of ocular
hypertension and chronic open-angle glaucoma, and refers when there is
optic-nerve-head damage on stereoscopic slit-lamp biomicroscopy. This underpins
the `raised_intraocular_pressure` and `optic_disc_abnormality` structured
findings, the `intraocular_pressure_right_mmhg` / `intraocular_pressure_left_mmhg`
measurements, and the abnormal-requiring-action / urgent-referral flags. An
**acutely** raised intraocular pressure (e.g. acute angle-closure glaucoma) is a
critical-result trigger.

- NICE NG81 *Glaucoma: diagnosis and management*.
  <https://www.nice.org.uk/guidance/ng81>

## Diabetic retinopathy grading

### NHS Diabetic Eye Screening Programme

The NHS Diabetic Eye Screening Programme grades retinal images for referable
disease. Retinopathy grades are **R0** (none), **R1** (background), **R2**
(pre-proliferative), and **R3** (proliferative; R3A active, R3S stable);
maculopathy is graded **M0** (none) or **M1** (present, defined as a feature
within one disc diameter of the foveal centre). Referable results such as R3A or
R2M1 require referral to the hospital eye service. This grading underpins the
form's `retinopathy_grade` enum (none / background / pre-proliferative /
proliferative / maculopathy / not-applicable), the `diabetic_retinopathy` and
`macular_abnormality` structured findings, and the value stored in the grade's
`reporting_category` (Axis B) for diabetic-eye studies. **Proliferative**
retinopathy is a critical-result trigger.

- NHS Diabetic Eye Screening Programme — grading definitions for referable
  disease.
  <https://www.gov.uk/government/publications/diabetic-eye-screening-retinal-image-grading-criteria>

## Optometric reporting context

- College of Optometrists — clinical management guidelines and referral
  pathways. <https://www.college-optometrists.org/>

## How the references map to the schema

| Reference | Schema element |
| --- | --- |
| RCOphth actionable reporting | `impression`, `recommended_follow_up`, follow-up-urgency axis |
| RCOphth mandatory report sections | report-completeness axis (`report_completeness_percent`) |
| RCOphth acute-eye emergencies | critical-result auto-escalation, `critical-result-alert` flag, `urgent-review` recommendation |
| RCOphth critical-finding communication | `critical_result_communicated`, `reported_to` |
| NICE NG81 (24 mmHg threshold, optic disc) | `intraocular_pressure_*_mmhg`, `raised_intraocular_pressure`, `optic_disc_abnormality` |
| NHS diabetic eye screening grades | `retinopathy_grade`, `diabetic_retinopathy`, `macular_abnormality`, `reporting_category` (Axis B) |
