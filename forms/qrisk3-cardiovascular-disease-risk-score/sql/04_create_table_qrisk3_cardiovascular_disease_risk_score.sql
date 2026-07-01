-- Main QRISK3 assessment record: assessment context, patient
-- identification, eligibility flags, and every QRISK3 model input
-- (demographics, lifestyle, cardiometabolic measurements, comorbidity
-- history, and medication). The computed grade, fired rules, and flags
-- live in dedicated child tables.

CREATE TABLE qrisk3_cardiovascular_disease_risk_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Assessment context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'nurse', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'pharmacy', 'nhs-health-check', 'other', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',

    -- Demographics
    age NUMERIC(4,1),
    sex VARCHAR(10) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', '')),
    ethnicity VARCHAR(25) NOT NULL DEFAULT '' CHECK (ethnicity IN ('white-or-not-stated', 'indian', 'pakistani', 'bangladeshi', 'other-asian', 'black-caribbean', 'black-african', 'chinese', 'other', '')),
    townsend_score NUMERIC(6,3),
    postcode VARCHAR(10) NOT NULL DEFAULT '',

    -- Lifestyle
    smoking_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (smoking_status IN ('non', 'ex', 'light', 'moderate', 'heavy', '')),
    body_mass_index NUMERIC(4,1),

    -- Cardiometabolic measurements
    diabetes_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (diabetes_status IN ('none', 'type1', 'type2', '')),
    cholesterol_hdl_ratio NUMERIC(4,2),
    systolic_blood_pressure NUMERIC(5,1),
    systolic_blood_pressure_sd NUMERIC(5,1),
    on_blood_pressure_treatment VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_blood_pressure_treatment IN ('yes', 'no', '')),

    -- Comorbidity history
    family_history_chd VARCHAR(5) NOT NULL DEFAULT '' CHECK (family_history_chd IN ('yes', 'no', '')),
    atrial_fibrillation VARCHAR(5) NOT NULL DEFAULT '' CHECK (atrial_fibrillation IN ('yes', 'no', '')),
    chronic_kidney_disease_stage VARCHAR(10) NOT NULL DEFAULT '' CHECK (chronic_kidney_disease_stage IN ('none', 'stage3', 'stage4', 'stage5', '')),
    migraine VARCHAR(5) NOT NULL DEFAULT '' CHECK (migraine IN ('yes', 'no', '')),
    rheumatoid_arthritis VARCHAR(5) NOT NULL DEFAULT '' CHECK (rheumatoid_arthritis IN ('yes', 'no', '')),
    systemic_lupus_erythematosus VARCHAR(5) NOT NULL DEFAULT '' CHECK (systemic_lupus_erythematosus IN ('yes', 'no', '')),
    severe_mental_illness VARCHAR(5) NOT NULL DEFAULT '' CHECK (severe_mental_illness IN ('yes', 'no', '')),
    erectile_dysfunction VARCHAR(5) NOT NULL DEFAULT '' CHECK (erectile_dysfunction IN ('yes', 'no', '')),

    -- Medication
    on_atypical_antipsychotics VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_atypical_antipsychotics IN ('yes', 'no', '')),
    on_corticosteroids VARCHAR(5) NOT NULL DEFAULT '' CHECK (on_corticosteroids IN ('yes', 'no', '')),

    -- Eligibility flags (not model inputs)
    has_established_cvd VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_established_cvd IN ('yes', 'no', '')),
    has_familial_hypercholesterolaemia VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_familial_hypercholesterolaemia IN ('yes', 'no', '')),

    -- Clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX qrisk3_cardiovascular_disease_risk_score_patient_id_idx
    ON qrisk3_cardiovascular_disease_risk_score (patient_id);
CREATE INDEX qrisk3_cardiovascular_disease_risk_score_clinician_id_idx
    ON qrisk3_cardiovascular_disease_risk_score (clinician_id);

CREATE TRIGGER trigger_qrisk3_cardiovascular_disease_risk_score_updated_at
    BEFORE UPDATE ON qrisk3_cardiovascular_disease_risk_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE qrisk3_cardiovascular_disease_risk_score IS
    'Main QRISK3 assessment record: assessment context, patient identification, eligibility flags, and every QRISK3 model input (demographics, lifestyle, cardiometabolic measurements, comorbidity history, and medication).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.clinician_role IS
    'Role of the assessing clinician: gp, nurse, pharmacist, or other.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.care_setting IS
    'Care setting: general-practice, pharmacy, nhs-health-check, or other.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.age IS
    'Age in years; QRISK3 is valid for ages 25-84.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.sex IS
    'Sex selecting the sex-specific QRISK3 model: female or male.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.ethnicity IS
    'Nine-category QRISK3 ethnicity: white-or-not-stated, indian, pakistani, bangladeshi, other-asian, black-caribbean, black-african, chinese, or other.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.townsend_score IS
    'Townsend deprivation score derived from postcode; optional (defaults to the cohort mean when null).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.postcode IS
    'Postcode used to look up the Townsend deprivation score.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.smoking_status IS
    'Smoking status: non, ex, light, moderate, or heavy.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.body_mass_index IS
    'Body mass index (BMI), kg/m^2; may be derived from height and weight.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.diabetes_status IS
    'Diabetes status: none, type1, or type2.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.cholesterol_hdl_ratio IS
    'Total-cholesterol to HDL-cholesterol ratio.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.systolic_blood_pressure IS
    'Mean systolic blood pressure in mmHg.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.systolic_blood_pressure_sd IS
    'Standard deviation of at least two systolic blood pressure readings (visit-to-visit variability), mmHg.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.on_blood_pressure_treatment IS
    'Whether the patient is on antihypertensive treatment.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.family_history_chd IS
    'First-degree relative with coronary heart disease before age 60.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.atrial_fibrillation IS
    'Whether the patient has atrial fibrillation.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.chronic_kidney_disease_stage IS
    'Chronic kidney disease stage: none, stage3, stage4, or stage5.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.migraine IS
    'Whether the patient has migraine.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.rheumatoid_arthritis IS
    'Whether the patient has rheumatoid arthritis.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.systemic_lupus_erythematosus IS
    'Whether the patient has systemic lupus erythematosus (SLE).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.severe_mental_illness IS
    'Whether the patient has a severe mental illness.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.erectile_dysfunction IS
    'Whether the patient has erectile dysfunction (men only; ignored for the female model).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.on_atypical_antipsychotics IS
    'Whether the patient is on atypical antipsychotic medication.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.on_corticosteroids IS
    'Whether the patient is on regular oral corticosteroids.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.has_established_cvd IS
    'Eligibility flag (not a model input): established cardiovascular disease makes QRISK3 inappropriate.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.has_familial_hypercholesterolaemia IS
    'Eligibility flag (not a model input): familial hypercholesterolaemia makes QRISK3 inappropriate.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
