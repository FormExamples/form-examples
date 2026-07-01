-- Main TIMI risk-score assessment record for unstable angina / NSTEMI:
-- assessment context, patient identification, and the seven scored
-- criterion inputs (age >= 65; >= 3 coronary risk factors; known CAD
-- stenosis >= 50%; aspirin use in the prior 7 days; >= 2 anginal
-- episodes in 24 h; ST deviation >= 0.5 mm; positive cardiac marker).
-- The computed grade, fired rules, and flags live in dedicated child
-- tables.

CREATE TABLE timi_risk_score_for_acute_coronary_syndrome (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('physician', 'cardiologist', 'nurse-practitioner', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'chest-pain-unit', 'ward', 'coronary-care', 'other', '')),
    working_diagnosis VARCHAR(20) NOT NULL DEFAULT '' CHECK (working_diagnosis IN ('unstable-angina', 'nstemi', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Criterion 1: age >= 65 years
    age_over_65 VARCHAR(5) NOT NULL DEFAULT '' CHECK (age_over_65 IN ('yes', 'no', '')),

    -- Criterion 2: >= 3 of five coronary-artery-disease risk factors
    three_or_more_cad_risk_factors VARCHAR(5) NOT NULL DEFAULT '' CHECK (three_or_more_cad_risk_factors IN ('yes', 'no', '')),

    -- Criterion 3: known coronary artery disease (stenosis >= 50%)
    known_cad_stenosis VARCHAR(5) NOT NULL DEFAULT '' CHECK (known_cad_stenosis IN ('yes', 'no', '')),

    -- Criterion 4: aspirin use in the prior 7 days
    aspirin_use_prior_7_days VARCHAR(5) NOT NULL DEFAULT '' CHECK (aspirin_use_prior_7_days IN ('yes', 'no', '')),

    -- Criterion 5: >= 2 anginal episodes in the prior 24 hours
    two_or_more_angina_episodes_24h VARCHAR(5) NOT NULL DEFAULT '' CHECK (two_or_more_angina_episodes_24h IN ('yes', 'no', '')),

    -- Criterion 6: ST deviation >= 0.5 mm on the presenting ECG
    st_deviation VARCHAR(5) NOT NULL DEFAULT '' CHECK (st_deviation IN ('yes', 'no', '')),

    -- Criterion 7: positive cardiac marker (elevated troponin / CK-MB)
    positive_cardiac_marker VARCHAR(5) NOT NULL DEFAULT '' CHECK (positive_cardiac_marker IN ('yes', 'no', '')),

    -- Clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX timi_risk_score_for_acute_coronary_syndrome_patient_id_idx
    ON timi_risk_score_for_acute_coronary_syndrome (patient_id);
CREATE INDEX timi_risk_score_for_acute_coronary_syndrome_clinician_id_idx
    ON timi_risk_score_for_acute_coronary_syndrome (clinician_id);

CREATE TRIGGER trigger_timi_risk_score_for_acute_coronary_syndrome_updated_at
    BEFORE UPDATE ON timi_risk_score_for_acute_coronary_syndrome
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE timi_risk_score_for_acute_coronary_syndrome IS
    'Main TIMI risk-score (UA/NSTEMI) assessment record: assessment context, patient identification, and the seven scored criterion inputs.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.clinician_role IS
    'Role of the assessing clinician: physician, cardiologist, nurse-practitioner, or other.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.care_setting IS
    'Care setting: emergency-department, chest-pain-unit, ward, coronary-care, or other.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.working_diagnosis IS
    'Working diagnosis: unstable-angina or nstemi.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.age_over_65 IS
    'Criterion 1 — age >= 65 years (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.three_or_more_cad_risk_factors IS
    'Criterion 2 — >= 3 of five coronary risk factors (hypertension, hypercholesterolaemia, diabetes, current smoking, family history of premature CAD) present (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.known_cad_stenosis IS
    'Criterion 3 — known coronary artery disease with stenosis >= 50% (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.aspirin_use_prior_7_days IS
    'Criterion 4 — aspirin use in the prior 7 days (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.two_or_more_angina_episodes_24h IS
    'Criterion 5 — >= 2 anginal episodes in the prior 24 hours (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.st_deviation IS
    'Criterion 6 — ST deviation >= 0.5 mm on the presenting ECG (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.positive_cardiac_marker IS
    'Criterion 7 — positive cardiac marker, elevated troponin or CK-MB (yes/no).';
COMMENT ON COLUMN timi_risk_score_for_acute_coronary_syndrome.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
