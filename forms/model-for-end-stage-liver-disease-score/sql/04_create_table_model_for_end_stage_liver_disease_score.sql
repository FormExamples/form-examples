-- Main MELD (Model for End-Stage Liver Disease) assessment record:
-- assessment context, patient identification, the chosen MELD variant,
-- and the laboratory inputs (total bilirubin, INR, serum creatinine,
-- dialysis history, serum sodium, and serum albumin). The computed
-- score, fired rules, and flags live in dedicated child tables.

CREATE TABLE model_for_end_stage_liver_disease_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('hepatologist', 'gastroenterologist', 'transplant-coordinator', 'intensivist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('hepatology-clinic', 'transplant-unit', 'intensive-care', 'ward', 'other', '')),
    meld_variant VARCHAR(10) NOT NULL DEFAULT '' CHECK (meld_variant IN ('meld', 'meld-na', 'meld-3', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: total bilirubin
    bilirubin NUMERIC(7,2),
    bilirubin_unit VARCHAR(10) NOT NULL DEFAULT '' CHECK (bilirubin_unit IN ('mg/dL', 'umol/L', '')),

    -- Step 4: INR
    inr NUMERIC(4,2),

    -- Step 5: serum creatinine
    creatinine NUMERIC(7,2),
    creatinine_unit VARCHAR(10) NOT NULL DEFAULT '' CHECK (creatinine_unit IN ('mg/dL', 'umol/L', '')),

    -- Step 6: renal replacement (dialysis rule inputs)
    dialysis_sessions_past_week INT,
    cvvhd_24h VARCHAR(5) NOT NULL DEFAULT '' CHECK (cvvhd_24h IN ('yes', 'no', '')),

    -- Step 7: serum sodium (MELD-Na and MELD 3.0)
    sodium NUMERIC(4,1),

    -- Step 8: serum albumin (MELD 3.0)
    albumin NUMERIC(4,2),

    -- Step 9: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX model_for_end_stage_liver_disease_score_patient_id_idx
    ON model_for_end_stage_liver_disease_score (patient_id);
CREATE INDEX model_for_end_stage_liver_disease_score_clinician_id_idx
    ON model_for_end_stage_liver_disease_score (clinician_id);

CREATE TRIGGER trigger_model_for_end_stage_liver_disease_score_updated_at
    BEFORE UPDATE ON model_for_end_stage_liver_disease_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE model_for_end_stage_liver_disease_score IS
    'Main MELD assessment record: assessment context, patient identification, chosen MELD variant, and the laboratory inputs (total bilirubin, INR, serum creatinine, dialysis history, serum sodium, and serum albumin).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.clinician_role IS
    'Role of the assessing clinician: hepatologist, gastroenterologist, transplant-coordinator, intensivist, or other.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.care_setting IS
    'Care setting: hepatology-clinic, transplant-unit, intensive-care, ward, or other.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.meld_variant IS
    'Chosen MELD variant: meld (original), meld-na (sodium-corrected), or meld-3 (MELD 3.0).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown (the female indicator is used by MELD 3.0).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.bilirubin IS
    'Measured total bilirubin, in the unit given by bilirubin_unit.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.bilirubin_unit IS
    'Unit for the bilirubin value: mg/dL or umol/L (converted to mg/dL by the engine).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.inr IS
    'International Normalised Ratio (INR) of prothrombin time.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.creatinine IS
    'Measured serum creatinine, in the unit given by creatinine_unit.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.creatinine_unit IS
    'Unit for the creatinine value: mg/dL or umol/L (converted to mg/dL by the engine).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.dialysis_sessions_past_week IS
    'Count of haemodialysis sessions in the past 7 days; >= 2 triggers the dialysis creatinine rule (creatinine set to 4.0 mg/dL).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.cvvhd_24h IS
    'Whether the patient received >= 24 h of continuous veno-venous haemodialysis (CVVHD) in the past 7 days; yes triggers the dialysis creatinine rule.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.sodium IS
    'Serum sodium in mEq/L; used by the MELD-Na and MELD 3.0 variants (clamped to 125-137).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.albumin IS
    'Serum albumin in g/dL; used by the MELD 3.0 variant (clamped to 1.5-3.5).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
