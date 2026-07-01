-- Main HAS-BLED assessment record: assessment context, patient
-- identification, and the nine scored criterion inputs (H, A-renal,
-- A-liver, S, B, L, E, D-drugs, D-alcohol). The computed grade, fired
-- rules, and flags live in dedicated child tables.

CREATE TABLE has_bled_score_for_major_bleeding_risk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('cardiology', 'general-practice', 'anticoagulation-clinic', 'acute-medical', 'other', '')),
    anticoagulation_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (anticoagulation_status IN ('on', 'considering', '')),
    cha_ds_vasc_score INT CHECK (cha_ds_vasc_score IS NULL OR cha_ds_vasc_score BETWEEN 0 AND 9),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INT CHECK (age_years IS NULL OR age_years BETWEEN 0 AND 130),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: H — hypertension, uncontrolled (SBP > 160 mmHg)
    hypertension_uncontrolled VARCHAR(5) NOT NULL DEFAULT '' CHECK (hypertension_uncontrolled IN ('yes', 'no', '')),

    -- Step 4: A — abnormal renal function (dialysis, transplant, or creatinine >= 200 umol/L)
    abnormal_renal_function VARCHAR(5) NOT NULL DEFAULT '' CHECK (abnormal_renal_function IN ('yes', 'no', '')),

    -- Step 5: A — abnormal liver function (cirrhosis, or bilirubin > 2x ULN with transaminases > 3x ULN)
    abnormal_liver_function VARCHAR(5) NOT NULL DEFAULT '' CHECK (abnormal_liver_function IN ('yes', 'no', '')),

    -- Step 6: S — stroke history (prior stroke)
    stroke_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (stroke_history IN ('yes', 'no', '')),

    -- Step 7: B — bleeding history or predisposition (prior major bleed, diathesis, or anaemia)
    bleeding_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (bleeding_history IN ('yes', 'no', '')),

    -- Step 8: L — labile INR (unstable/high INR or time-in-therapeutic-range < 60%)
    labile_inr VARCHAR(5) NOT NULL DEFAULT '' CHECK (labile_inr IN ('yes', 'no', '')),

    -- Step 9: E — elderly is derived from age_years (> 65); no separate boolean.

    -- Step 10: D — drugs (concomitant antiplatelets or NSAIDs)
    antiplatelet_or_nsaid VARCHAR(5) NOT NULL DEFAULT '' CHECK (antiplatelet_or_nsaid IN ('yes', 'no', '')),

    -- Step 11: D — alcohol (units per week; >= 8 scores the criterion)
    alcohol_units_per_week NUMERIC(4,1) CHECK (alcohol_units_per_week IS NULL OR alcohol_units_per_week >= 0),

    -- Step 12: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX has_bled_score_for_major_bleeding_risk_patient_id_idx
    ON has_bled_score_for_major_bleeding_risk (patient_id);
CREATE INDEX has_bled_score_for_major_bleeding_risk_clinician_id_idx
    ON has_bled_score_for_major_bleeding_risk (clinician_id);

CREATE TRIGGER trigger_has_bled_score_for_major_bleeding_risk_updated_at
    BEFORE UPDATE ON has_bled_score_for_major_bleeding_risk
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE has_bled_score_for_major_bleeding_risk IS
    'Main HAS-BLED assessment record: assessment context, patient identification, and the nine scored criterion inputs (hypertension, abnormal renal function, abnormal liver function, stroke, bleeding, labile INR, elderly, drugs, alcohol).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, pharmacist, or other.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.care_setting IS
    'Care setting: cardiology, general-practice, anticoagulation-clinic, acute-medical, or other.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.anticoagulation_status IS
    'Whether the patient is already on, or is being considered for, oral anticoagulation: on or considering.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.cha_ds_vasc_score IS
    'Optional paired CHA2DS2-VASc stroke-risk score (0-9), recorded as context only; not computed by this form.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.age_years IS
    'Patient age in whole years; drives criterion E (elderly, > 65). NULL when unanswered, contributing 0 points and raising a completeness flag.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.hypertension_uncontrolled IS
    'Criterion H — uncontrolled hypertension (systolic blood pressure > 160 mmHg): yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.abnormal_renal_function IS
    'Criterion A (renal) — abnormal renal function (dialysis, transplant, or creatinine >= 200 umol/L): yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.abnormal_liver_function IS
    'Criterion A (liver) — abnormal liver function (cirrhosis, or bilirubin > 2x ULN with transaminases > 3x ULN): yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.stroke_history IS
    'Criterion S — prior stroke: yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.bleeding_history IS
    'Criterion B — prior major bleed, bleeding diathesis, or anaemia: yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.labile_inr IS
    'Criterion L — labile INR (unstable or high INR, or time in therapeutic range < 60%): yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.antiplatelet_or_nsaid IS
    'Criterion D (drugs) — concomitant antiplatelet agents or NSAIDs: yes or no.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.alcohol_units_per_week IS
    'Criterion D (alcohol) — alcohol consumption in units per week; >= 8 scores the criterion. NULL when unanswered, contributing 0 points and raising a completeness flag.';
COMMENT ON COLUMN has_bled_score_for_major_bleeding_risk.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
