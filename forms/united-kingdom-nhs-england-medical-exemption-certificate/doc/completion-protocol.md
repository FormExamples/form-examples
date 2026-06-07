# Completion protocol — FP92A

## Application workflow

1. **Patient initiates** the application by completing the personal
   details on FP92A.
2. **Registered medical practitioner** (GMC) certifies that the patient
   has one of the conditions listed in SI 2015/570 Schedule 1.
3. **NHSBSA** receives the application, verifies, and issues the
   exemption certificate. The certificate is posted to the patient with
   a unique reference and a five-year validity period.

## Mapping conditions to evidence

The implementation captures the exempt condition under controlled
vocabulary aligned with the SI 2015/570 Schedule 1 list:

| Exempt condition | SNOMED CT (UK Edition) reference family |
| --- | --- |
| Permanent fistula | 91487003 \| Permanent stoma (disorder) \| and descendants |
| Hypoadrenalism (e.g. Addison's) | 363732003 \| Adrenocortical insufficiency \| |
| Diabetes insipidus / hypopituitarism | 15771004 \| Diabetes insipidus (disorder) \| / 36976004 \| Hypopituitarism (disorder) \| |
| Diabetes mellitus (non-diet treated) | 73211009 \| Diabetes mellitus (disorder) \| |
| Hypoparathyroidism | 36976004 / 84393006 \| Hypoparathyroidism (disorder) \| |
| Myasthenia gravis | 91637004 \| Myasthenia gravis (disorder) \| |
| Myxoedema | 40930008 \| Hypothyroidism (disorder) \| |
| Epilepsy on continuous AED | 84757009 \| Epilepsy (disorder) \| |
| Continuing physical disability needing help to go out | code per individual cause |
| Cancer (active or post-treatment) | 363346000 \| Malignant neoplastic disease (disorder) \| |

(Practitioners select the exact SNOMED concept appropriate to the
patient; the table is indicative of the SI 2015/570 category alignment.)

## Field-by-field guidance

| Field | Notes |
| --- | --- |
| Patient surname / forename / DOB | as registered with the practitioner |
| Patient address and postcode | for certificate dispatch |
| NHS number | optional but accelerates verification |
| Exempt condition | drop-down anchored to SI 2015/570 Sch. 1 |
| Practitioner name / GMC number / practice address | certifies the condition |
| Practitioner signature / date | wet-ink or qualified digital signature |
| Patient declaration / signature | confirms application is for self |

## Renewal

- Certificates expire after **five years**. A renewal application is
  required; conditions may change and so must be re-certified.
- The NHSBSA writes to certificate holders before expiry as a courtesy
  reminder; the obligation to renew remains with the holder.

## Common errors flagged in this implementation

1. Selected condition not in SI 2015/570 Sch. 1 — invalid; the patient
   should consider HC2/HC3 (NHS Low Income Scheme) instead.
2. **Diabetes mellitus, diet only** — explicitly **not** exempt under
   item 4; flagged at submission.
3. **Temporary disability** — explicitly **not** exempt under item 9.
4. Practitioner not on the GMC register.
5. Patient already has an unexpired FP92A — flagged for de-duplication.

## Other exemption pathways (cross-references)

If the patient does **not** qualify for FP92A, other routes to free
prescriptions include:

- Prescription Prepayment Certificate (PPC) — cost-saving, not exemption.
- Maternity Exemption Certificate (FW8) for pregnancy and 12 months
  post-partum.
- Age 60+ (automatic via age).
- Under 16, or 16–18 in full-time education.
- HC2 (full help) under the NHS Low Income Scheme.
- War Pension / Armed Forces Compensation Scheme exemption.

See <https://www.nhsbsa.nhs.uk/help-nhs-costs-hc11>.
