-- Main hypertension annual-review record: one UK primary-care annual review
-- (NICE NG136) documenting clinic and home/ambulatory blood pressure,
-- diagnosis and comorbidity (blood-pressure target drivers), medication and
-- adherence, cardiovascular risk (QRISK), annual bloods (U&E, HbA1c, lipids),
-- urine albumin:creatinine ratio (ACR), lifestyle, and complications, plus
-- patient / clinician identification and review context. The computed
-- control-classification and completeness grade, the audit trail of fired
-- rules, and the flags live in dedicated child tables. This is a
-- documentation and control-classification record, not a diagnostic or
-- prescribing instrument.

CREATE TABLE hypertension_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'practice-nurse', 'pharmacist', 'other', '')),
    reviewed_at DATE,
    practice_site VARCHAR(200) NOT NULL DEFAULT '',
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-59', '60-79', '>=80', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    ethnicity VARCHAR(30) NOT NULL DEFAULT '' CHECK (ethnicity IN ('white', 'black-african-caribbean', 'south-asian', 'mixed', 'other', '')),

    -- Diagnosis and comorbidity (blood-pressure target drivers)
    diagnosis_date DATE,
    type2_diabetes VARCHAR(5) NOT NULL DEFAULT '' CHECK (type2_diabetes IN ('yes', 'no', '')),
    chronic_kidney_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (chronic_kidney_disease IN ('yes', 'no', '')),
    established_cvd VARCHAR(5) NOT NULL DEFAULT '' CHECK (established_cvd IN ('yes', 'no', '')),
    atrial_fibrillation VARCHAR(5) NOT NULL DEFAULT '' CHECK (atrial_fibrillation IN ('yes', 'no', '')),

    -- Blood pressure (mmHg)
    clinic_systolic INTEGER,
    clinic_diastolic INTEGER,
    home_systolic INTEGER,
    home_diastolic INTEGER,
    monitoring_method VARCHAR(15) NOT NULL DEFAULT '' CHECK (monitoring_method IN ('clinic-only', 'hbpm', 'abpm', '')),
    postural_drop VARCHAR(5) NOT NULL DEFAULT '' CHECK (postural_drop IN ('yes', 'no', '')),

    -- Medication and adherence
    antihypertensive_agents INTEGER,
    adherence VARCHAR(10) NOT NULL DEFAULT '' CHECK (adherence IN ('good', 'partial', 'poor', '')),
    side_effects VARCHAR(5) NOT NULL DEFAULT '' CHECK (side_effects IN ('yes', 'no', '')),

    -- Cardiovascular risk and lifestyle
    qrisk_percent NUMERIC(4,1),
    smoking_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (smoking_status IN ('never', 'ex', 'current', '')),
    statin_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (statin_therapy IN ('yes', 'no', '')),
    bmi NUMERIC(4,1),
    lifestyle_advice TEXT NOT NULL DEFAULT '',

    -- Annual bloods (U&E, HbA1c, lipids)
    serum_creatinine NUMERIC(5,1),
    egfr NUMERIC(5,1),
    serum_potassium NUMERIC(3,1),
    hba1c NUMERIC(4,1),
    total_cholesterol NUMERIC(3,1),
    hdl_cholesterol NUMERIC(3,1),

    -- Urine albumin:creatinine ratio
    urine_acr NUMERIC(6,1),

    -- Complications and free-text context
    complications TEXT NOT NULL DEFAULT '',
    review_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX hypertension_review_patient_id_idx
    ON hypertension_review (patient_id);
CREATE INDEX hypertension_review_clinician_id_idx
    ON hypertension_review (clinician_id);

CREATE TRIGGER trigger_hypertension_review_updated_at
    BEFORE UPDATE ON hypertension_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hypertension_review IS
    'Main hypertension annual-review record (NICE NG136): patient and clinician identification, review context, diagnosis and comorbidity target drivers, clinic and home/ambulatory blood pressure, medication and adherence, cardiovascular risk, annual bloods, urine ACR, lifestyle, and complications. The computed control classification, completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN hypertension_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hypertension_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hypertension_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hypertension_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hypertension_review.patient_id IS
    'Foreign key to the patient this review documents (restrict delete).';
COMMENT ON COLUMN hypertension_review.clinician_id IS
    'Foreign key to the reviewing clinician (restrict delete); optional.';
COMMENT ON COLUMN hypertension_review.clinician_role IS
    'Reviewing clinician role: gp, practice-nurse, pharmacist, or other.';
COMMENT ON COLUMN hypertension_review.reviewed_at IS
    'Date the annual review was conducted.';
COMMENT ON COLUMN hypertension_review.practice_site IS
    'Practice or site where the review was conducted.';
COMMENT ON COLUMN hypertension_review.patient_identifier IS
    'NHS number or local patient identifier as recorded on the review.';
COMMENT ON COLUMN hypertension_review.age_band IS
    'Adult age band that drives the blood-pressure target: 18-39, 40-59, 60-79, or >=80 (>=80 relaxes the clinic target to 150/90).';
COMMENT ON COLUMN hypertension_review.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN hypertension_review.ethnicity IS
    'Patient ethnicity: white, black-african-caribbean, south-asian, mixed, or other.';
COMMENT ON COLUMN hypertension_review.diagnosis_date IS
    'Date of hypertension diagnosis.';
COMMENT ON COLUMN hypertension_review.type2_diabetes IS
    'Whether the patient has type 2 diabetes (yes/no); a blood-pressure target driver.';
COMMENT ON COLUMN hypertension_review.chronic_kidney_disease IS
    'Whether the patient has chronic kidney disease (yes/no); with diabetes or ACR >= 70 it tightens the target to 130/80.';
COMMENT ON COLUMN hypertension_review.established_cvd IS
    'Whether the patient has established cardiovascular disease (yes/no).';
COMMENT ON COLUMN hypertension_review.atrial_fibrillation IS
    'Whether the patient has atrial fibrillation (yes/no).';
COMMENT ON COLUMN hypertension_review.clinic_systolic IS
    'Clinic systolic blood pressure in mmHg (best of repeated seated readings).';
COMMENT ON COLUMN hypertension_review.clinic_diastolic IS
    'Clinic diastolic blood pressure in mmHg (best of repeated seated readings).';
COMMENT ON COLUMN hypertension_review.home_systolic IS
    'Home/ambulatory (HBPM/ABPM) daytime-average systolic blood pressure in mmHg.';
COMMENT ON COLUMN hypertension_review.home_diastolic IS
    'Home/ambulatory (HBPM/ABPM) daytime-average diastolic blood pressure in mmHg.';
COMMENT ON COLUMN hypertension_review.monitoring_method IS
    'Blood-pressure monitoring method: clinic-only, hbpm (home), or abpm (ambulatory).';
COMMENT ON COLUMN hypertension_review.postural_drop IS
    'Whether a symptomatic postural systolic fall >= 20 mmHg is present (yes/no).';
COMMENT ON COLUMN hypertension_review.antihypertensive_agents IS
    'Count of current antihypertensive agents.';
COMMENT ON COLUMN hypertension_review.adherence IS
    'Self-reported medication adherence: good, partial, or poor.';
COMMENT ON COLUMN hypertension_review.side_effects IS
    'Whether troublesome medication side effects are present (yes/no).';
COMMENT ON COLUMN hypertension_review.qrisk_percent IS
    'QRISK 10-year cardiovascular risk as a percentage.';
COMMENT ON COLUMN hypertension_review.smoking_status IS
    'Smoking status: never, ex, or current.';
COMMENT ON COLUMN hypertension_review.statin_therapy IS
    'Whether the patient is on a statin (yes/no).';
COMMENT ON COLUMN hypertension_review.bmi IS
    'Body mass index in kg/m^2.';
COMMENT ON COLUMN hypertension_review.lifestyle_advice IS
    'Free-text record of lifestyle advice given (diet, exercise, alcohol, salt, smoking cessation).';
COMMENT ON COLUMN hypertension_review.serum_creatinine IS
    'Serum creatinine in micromol/L (U&E).';
COMMENT ON COLUMN hypertension_review.egfr IS
    'Estimated glomerular filtration rate in mL/min/1.73m^2 (U&E).';
COMMENT ON COLUMN hypertension_review.serum_potassium IS
    'Serum potassium in mmol/L (U&E).';
COMMENT ON COLUMN hypertension_review.hba1c IS
    'HbA1c in mmol/mol (glycaemic control).';
COMMENT ON COLUMN hypertension_review.total_cholesterol IS
    'Total cholesterol in mmol/L (lipids).';
COMMENT ON COLUMN hypertension_review.hdl_cholesterol IS
    'HDL cholesterol in mmol/L (lipids).';
COMMENT ON COLUMN hypertension_review.urine_acr IS
    'Urine albumin:creatinine ratio in mg/mmol.';
COMMENT ON COLUMN hypertension_review.complications IS
    'Free-text record of hypertension-related complications or target-organ damage.';
COMMENT ON COLUMN hypertension_review.review_context IS
    'Optional free-text review context or narrative shown in the summary.';
