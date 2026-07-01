-- Main Padua VTE risk-assessment record: assessment context, patient
-- identification, the eleven weighted risk-factor inputs, and the
-- informational bleeding-risk check. The computed grade, fired rules,
-- and flags live in dedicated child tables.

CREATE TABLE padua_venous_thromboembolism_risk_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('acute-medical', 'general-medical', 'admissions-unit', 'other', '')),
    admission_reason TEXT NOT NULL DEFAULT '',

    -- Patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years NUMERIC(4,1),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Risk factor 1 — active cancer (3 points)
    active_cancer VARCHAR(10) NOT NULL DEFAULT '' CHECK (active_cancer IN ('yes', 'no', '')),
    -- Risk factor 2 — previous VTE (3 points)
    previous_vte VARCHAR(10) NOT NULL DEFAULT '' CHECK (previous_vte IN ('yes', 'no', '')),
    -- Risk factor 3 — reduced mobility >= 3 days (3 points)
    reduced_mobility VARCHAR(10) NOT NULL DEFAULT '' CHECK (reduced_mobility IN ('yes', 'no', '')),
    -- Risk factor 4 — known thrombophilia (3 points)
    known_thrombophilia VARCHAR(10) NOT NULL DEFAULT '' CHECK (known_thrombophilia IN ('yes', 'no', '')),
    -- Risk factor 5 — recent trauma or surgery <= 1 month (2 points)
    recent_trauma_or_surgery VARCHAR(10) NOT NULL DEFAULT '' CHECK (recent_trauma_or_surgery IN ('yes', 'no', '')),
    -- Risk factor 6 — age >= 70 (1 point); derived from age_years above
    -- Risk factor 7 — heart and/or respiratory failure (1 point)
    heart_or_respiratory_failure VARCHAR(10) NOT NULL DEFAULT '' CHECK (heart_or_respiratory_failure IN ('yes', 'no', '')),
    -- Risk factor 8 — acute MI or ischaemic stroke (1 point)
    acute_mi_or_ischaemic_stroke VARCHAR(10) NOT NULL DEFAULT '' CHECK (acute_mi_or_ischaemic_stroke IN ('yes', 'no', '')),
    -- Risk factor 9 — acute infection and/or rheumatological disorder (1 point)
    acute_infection_or_rheumatological VARCHAR(10) NOT NULL DEFAULT '' CHECK (acute_infection_or_rheumatological IN ('yes', 'no', '')),
    -- Risk factor 10 — obesity BMI >= 30 (1 point); derived from body_mass_index below
    body_mass_index NUMERIC(4,1),
    -- Risk factor 11 — ongoing hormonal treatment (1 point)
    ongoing_hormonal_treatment VARCHAR(10) NOT NULL DEFAULT '' CHECK (ongoing_hormonal_treatment IN ('yes', 'no', '')),

    -- Bleeding-risk check (informational; gates the recommendation, not the score)
    active_bleeding VARCHAR(10) NOT NULL DEFAULT '' CHECK (active_bleeding IN ('yes', 'no', '')),
    high_bleeding_risk VARCHAR(10) NOT NULL DEFAULT '' CHECK (high_bleeding_risk IN ('yes', 'no', '')),

    -- Clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX padua_venous_thromboembolism_risk_assessment_patient_id_idx
    ON padua_venous_thromboembolism_risk_assessment (patient_id);
CREATE INDEX padua_venous_thromboembolism_risk_assessment_clinician_id_idx
    ON padua_venous_thromboembolism_risk_assessment (clinician_id);

CREATE TRIGGER trigger_padua_venous_thromboembolism_risk_assessment_updated_at
    BEFORE UPDATE ON padua_venous_thromboembolism_risk_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE padua_venous_thromboembolism_risk_assessment IS
    'Main Padua VTE risk-assessment record: assessment context, patient identification, the eleven weighted risk-factor inputs, and the informational bleeding-risk check.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, pharmacist, or other.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.care_setting IS
    'Care setting: acute-medical, general-medical, admissions-unit, or other.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.admission_reason IS
    'Free-text reason for the patient''s admission.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.age_years IS
    'Patient age in years; drives risk factor 6 (age >= 70 scores 1 point). Null when unanswered.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.active_cancer IS
    'Risk factor 1 — active cancer (3 points): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.previous_vte IS
    'Risk factor 2 — previous VTE, excluding superficial vein thrombosis (3 points): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.reduced_mobility IS
    'Risk factor 3 — reduced mobility (bed rest with bathroom privileges) for at least 3 days (3 points): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.known_thrombophilia IS
    'Risk factor 4 — known thrombophilic condition (3 points): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.recent_trauma_or_surgery IS
    'Risk factor 5 — recent (<= 1 month) trauma and/or surgery (2 points): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.heart_or_respiratory_failure IS
    'Risk factor 7 — acute heart failure and/or respiratory failure (1 point): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.acute_mi_or_ischaemic_stroke IS
    'Risk factor 8 — acute myocardial infarction or ischaemic stroke (1 point): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.acute_infection_or_rheumatological IS
    'Risk factor 9 — acute infection and/or rheumatological disorder (1 point): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.body_mass_index IS
    'Body mass index (BMI), kg/m^2; drives risk factor 10 (obesity BMI >= 30 scores 1 point). Null when unanswered.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.ongoing_hormonal_treatment IS
    'Risk factor 11 — ongoing hormonal treatment (1 point): yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.active_bleeding IS
    'Bleeding-risk check — active bleeding present; contraindicates pharmacological prophylaxis. Does not change the score. Yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.high_bleeding_risk IS
    'Bleeding-risk check — other high bleeding-risk factors present; gates the recommendation. Does not change the score. Yes or no.';
COMMENT ON COLUMN padua_venous_thromboembolism_risk_assessment.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
