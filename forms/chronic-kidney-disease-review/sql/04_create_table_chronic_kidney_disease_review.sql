-- Main chronic kidney disease annual-review record: one UK primary-care CKD
-- review (NICE NG203) documenting the two KDIGO staging measurements (current
-- eGFR and urine ACR), the prior eGFR for the decline check, blood pressure, a
-- structured medication review (ACEi/ARB, SGLT2 inhibitor, statin, nephrotoxin
-- check), and the core CKD bloods (potassium, bicarbonate, calcium, phosphate,
-- PTH, haemoglobin, HbA1c), plus patient / clinician identification and review
-- context. The derived G-stage, albuminuria stage, KDIGO risk zone, review
-- completeness grade, the audit trail of fired rules, and the flags live in
-- dedicated child tables. This is a documentation and classification record,
-- not a diagnostic or prescribing instrument.

CREATE TABLE chronic_kidney_disease_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(200) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'nurse', 'pharmacist', 'nephrology', 'other', '')),
    reviewed_at DATE,
    care_setting VARCHAR(35) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'long-term-conditions-clinic', 'community-nephrology', 'other', '')),
    review_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (review_type IN ('annual', 'interval', 'post-referral', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-59', '60-79', '>=80', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    diabetes_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (diabetes_status IN ('none', 'type1', 'type2', '')),
    primary_cause VARCHAR(15) NOT NULL DEFAULT '' CHECK (primary_cause IN ('diabetic', 'hypertensive', 'glomerular', 'polycystic', 'obstructive', 'unknown', 'other', '')),
    months_since_diagnosis INTEGER,

    -- Renal function
    egfr NUMERIC(5,1),
    egfr_sample_date DATE,
    previous_egfr NUMERIC(5,1),
    previous_egfr_date DATE,

    -- Albuminuria
    acr NUMERIC(6,1),
    acr_sample_date DATE,
    acr_measured VARCHAR(5) NOT NULL DEFAULT '' CHECK (acr_measured IN ('yes', 'no', '')),

    -- Blood pressure (mmHg)
    systolic_blood_pressure INTEGER,
    diastolic_blood_pressure INTEGER,

    -- Medication review
    acei_or_arb_prescribed VARCHAR(15) NOT NULL DEFAULT '' CHECK (acei_or_arb_prescribed IN ('yes', 'no', 'contraindicated', '')),
    sglt2i_prescribed VARCHAR(15) NOT NULL DEFAULT '' CHECK (sglt2i_prescribed IN ('yes', 'no', 'not-indicated', '')),
    statin_prescribed VARCHAR(10) NOT NULL DEFAULT '' CHECK (statin_prescribed IN ('yes', 'no', 'declined', '')),
    nephrotoxic_drug_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (nephrotoxic_drug_present IN ('yes', 'no', '')),
    nephrotoxic_dose_adjusted VARCHAR(15) NOT NULL DEFAULT '' CHECK (nephrotoxic_dose_adjusted IN ('yes', 'no', 'not-applicable', '')),
    medication_review_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (medication_review_completed IN ('yes', 'no', '')),

    -- Metabolic bloods
    hba1c NUMERIC(4,1),
    potassium NUMERIC(3,1),
    bicarbonate NUMERIC(3,1),
    calcium NUMERIC(4,2),
    phosphate NUMERIC(4,2),
    pth NUMERIC(5,1),
    haemoglobin NUMERIC(4,1),

    -- Referral and summary
    referral_decision VARCHAR(30) NOT NULL DEFAULT '' CHECK (referral_decision IN ('none', 'monitor', 'refer-nephrology', 'already-under-nephrology', '')),
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX chronic_kidney_disease_review_patient_id_idx
    ON chronic_kidney_disease_review (patient_id);
CREATE INDEX chronic_kidney_disease_review_clinician_id_idx
    ON chronic_kidney_disease_review (clinician_id);

CREATE TRIGGER trigger_chronic_kidney_disease_review_updated_at
    BEFORE UPDATE ON chronic_kidney_disease_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE chronic_kidney_disease_review IS
    'Main chronic kidney disease annual-review record (NICE NG203): patient and clinician identification, review context, the two KDIGO staging measurements (current eGFR and urine ACR), the prior eGFR for the decline check, blood pressure, a structured medication review, and the core CKD bloods. The derived G-stage, albuminuria stage, KDIGO risk zone, completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN chronic_kidney_disease_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN chronic_kidney_disease_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN chronic_kidney_disease_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN chronic_kidney_disease_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN chronic_kidney_disease_review.patient_id IS
    'Foreign key to the patient this review documents (restrict delete).';
COMMENT ON COLUMN chronic_kidney_disease_review.clinician_id IS
    'Foreign key to the reviewing clinician (restrict delete); optional.';
COMMENT ON COLUMN chronic_kidney_disease_review.clinician_name IS
    'Name of the reviewing clinician as recorded on the review.';
COMMENT ON COLUMN chronic_kidney_disease_review.clinician_role IS
    'Reviewing clinician role: gp, nurse, pharmacist, nephrology, or other.';
COMMENT ON COLUMN chronic_kidney_disease_review.reviewed_at IS
    'Date the CKD review was conducted.';
COMMENT ON COLUMN chronic_kidney_disease_review.care_setting IS
    'Care setting of the review: general-practice, long-term-conditions-clinic, community-nephrology, or other.';
COMMENT ON COLUMN chronic_kidney_disease_review.review_type IS
    'Review type: annual, interval, or post-referral.';
COMMENT ON COLUMN chronic_kidney_disease_review.patient_identifier IS
    'NHS number or local patient identifier as recorded on the review.';
COMMENT ON COLUMN chronic_kidney_disease_review.age_band IS
    'Adult age band: 18-39, 40-59, 60-79, or >=80.';
COMMENT ON COLUMN chronic_kidney_disease_review.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN chronic_kidney_disease_review.diabetes_status IS
    'Diabetes status: none, type1, or type2; drives the tighter 130/80 blood-pressure target.';
COMMENT ON COLUMN chronic_kidney_disease_review.primary_cause IS
    'Primary cause of CKD: diabetic, hypertensive, glomerular, polycystic, obstructive, unknown, or other.';
COMMENT ON COLUMN chronic_kidney_disease_review.months_since_diagnosis IS
    'Duration of known CKD in months.';
COMMENT ON COLUMN chronic_kidney_disease_review.egfr IS
    'Current estimated glomerular filtration rate in mL/min/1.73m^2; maps to the G-stage.';
COMMENT ON COLUMN chronic_kidney_disease_review.egfr_sample_date IS
    'Date of the current eGFR sample.';
COMMENT ON COLUMN chronic_kidney_disease_review.previous_egfr IS
    'Prior estimated glomerular filtration rate in mL/min/1.73m^2, used for the rapid-decline check.';
COMMENT ON COLUMN chronic_kidney_disease_review.previous_egfr_date IS
    'Date of the prior eGFR sample.';
COMMENT ON COLUMN chronic_kidney_disease_review.acr IS
    'Urine albumin:creatinine ratio in mg/mmol; maps to the albuminuria stage.';
COMMENT ON COLUMN chronic_kidney_disease_review.acr_sample_date IS
    'Date of the urine ACR sample.';
COMMENT ON COLUMN chronic_kidney_disease_review.acr_measured IS
    'Whether the urine ACR was measured at this review (yes/no).';
COMMENT ON COLUMN chronic_kidney_disease_review.systolic_blood_pressure IS
    'Systolic blood pressure in mmHg.';
COMMENT ON COLUMN chronic_kidney_disease_review.diastolic_blood_pressure IS
    'Diastolic blood pressure in mmHg.';
COMMENT ON COLUMN chronic_kidney_disease_review.acei_or_arb_prescribed IS
    'ACE inhibitor or ARB (RAAS blockade) status: yes, no, or contraindicated.';
COMMENT ON COLUMN chronic_kidney_disease_review.sglt2i_prescribed IS
    'SGLT2 inhibitor status: yes, no, or not-indicated.';
COMMENT ON COLUMN chronic_kidney_disease_review.statin_prescribed IS
    'Statin (cardiovascular risk) status: yes, no, or declined.';
COMMENT ON COLUMN chronic_kidney_disease_review.nephrotoxic_drug_present IS
    'Whether a nephrotoxic drug (e.g. NSAID, certain antibiotics) is present (yes/no).';
COMMENT ON COLUMN chronic_kidney_disease_review.nephrotoxic_dose_adjusted IS
    'Whether any nephrotoxic drug was dose-adjusted or held: yes, no, or not-applicable.';
COMMENT ON COLUMN chronic_kidney_disease_review.medication_review_completed IS
    'Whether a structured medication review was documented (yes/no).';
COMMENT ON COLUMN chronic_kidney_disease_review.hba1c IS
    'HbA1c in mmol/mol (glycaemic control).';
COMMENT ON COLUMN chronic_kidney_disease_review.potassium IS
    'Serum potassium in mmol/L (hyperkalaemia check).';
COMMENT ON COLUMN chronic_kidney_disease_review.bicarbonate IS
    'Serum bicarbonate in mmol/L (acidosis check).';
COMMENT ON COLUMN chronic_kidney_disease_review.calcium IS
    'Serum calcium in mmol/L (CKD-MBD).';
COMMENT ON COLUMN chronic_kidney_disease_review.phosphate IS
    'Serum phosphate in mmol/L (CKD-MBD).';
COMMENT ON COLUMN chronic_kidney_disease_review.pth IS
    'Parathyroid hormone in pmol/L (CKD-MBD).';
COMMENT ON COLUMN chronic_kidney_disease_review.haemoglobin IS
    'Haemoglobin in g/L (anaemia of CKD check).';
COMMENT ON COLUMN chronic_kidney_disease_review.referral_decision IS
    'Referral decision: none, monitor, refer-nephrology, or already-under-nephrology.';
COMMENT ON COLUMN chronic_kidney_disease_review.clinical_note IS
    'Optional free-text clinical note or narrative shown in the summary.';
