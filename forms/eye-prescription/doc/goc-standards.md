# UK GOC Standards of Practice Mapping

This form is designed to comply with the **General Optical Council
*Standards of Practice for Optometrists and Dispensing Opticians***,
effective April 2016 and updated since. The Standards are mandatory for
every GOC-registered optometrist and dispensing optician in the United
Kingdom.

Source: <https://standards.optical.org/>

## Mapping of GOC standards to form fields

| GOC Standard | Form support |
| --- | --- |
| **1.** Listen to patients and ensure they are at the heart of the decisions made about their care. | Step 9 (Lens recommendation) records patient preferences; the prescription includes a free-text "patient notes" field. |
| **2.** Communicate effectively with your patients. | The output PDF and HTML report are written for the patient and labelled in plain English. |
| **3.** Obtain valid consent. | Step 1 (Prescriber) and step 11 (Sign-off) record a `consent_obtained` boolean. |
| **4.** Show care and compassion for your patients. | n/a — behavioural standard. |
| **5.** Keep your knowledge and skills up to date. | n/a — practitioner standard. |
| **6.** Recognize, and work within, your limits of competence. | Step 11 includes an explicit *refer to ophthalmologist* button that fires the `refer-ophthalmology` flag. |
| **7.** Conduct appropriate assessments, examinations, treatments and referrals. | Steps 4 (Visual acuity), 5–6 (Refraction), 10 (Ocular health) and the safety-flag engine. |
| **8.** Maintain adequate patient records. | Every field is timestamped, soft-deletable, and includes the prescriber's GOC number; the FHIR Bundle is exportable to the EHR. |
| **9.** Ensure that supervision is undertaken appropriately. | Step 1 captures the prescriber's role (`optometrist` / `dispensing optician`) and optional supervising practitioner. |
| **10.** Work collaboratively with colleagues. | The dashboard supports filtering by prescriber. |
| **11.** Protect and safeguard patients, colleagues and others from harm. | The safety-flag engine (high myopia, ocular pathology, paediatric) flags concerns. |
| **12.** Ensure a safe environment for your patients. | n/a — physical environment. |
| **13.** Show respect and fairness to people and provide equal access to care. | The form supports translated outputs (deferred — see plan.md). |
| **14.** Maintain confidentiality and respect your patients' privacy. | NHS number is stored encrypted; PDF output redacts identifying data when "patient summary" mode is selected. |
| **15.** Maintain appropriate boundaries with others. | n/a — behavioural. |
| **16.** Be honest and trustworthy. | n/a — behavioural. |
| **17.** Do not damage the reputation of your profession through your conduct. | n/a — behavioural. |
| **18.** Respond to complaints effectively. | Out of scope. |
| **19.** Be candid when things have gone wrong. | Step 11 includes a free-text "incident notes" field. |

## Legal basis

- **Opticians Act 1989** (c. 44) — defines who may carry out a sight test
  and who may issue a prescription.
  <https://www.legislation.gov.uk/ukpga/1989/44/contents>
- **The Sight Testing (Examination and Prescription) (No 2) Regulations
  1989** (SI 1989/1230) — specifies the **required content** of a
  spectacle prescription. Every required field is captured by this form
  — see `refractive-classification-rules.md` for the per-field mapping.
- **The Sale of Optical Appliances Order 1984** (SI 1984/1778) — restricts
  who may sell glasses based on the prescription.

## Prescription validity

GOC convention (also reflected in the NHS GOS3 voucher) is:

- **2 years** for patients aged 16–69 inclusive.
- **1 year** for patients aged < 16 or ≥ 70.

The form computes the default expiry from the patient's date of birth and
the issue date; the prescriber may override with a documented reason.
