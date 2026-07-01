-- Main GRACE assessment record: assessment context, patient
-- identification, and the eight GRACE variable inputs (age, heart rate,
-- systolic blood pressure, serum creatinine, Killip class, cardiac
-- arrest at admission, ST-segment deviation, elevated cardiac enzymes).
-- The computed grade, fired rules, and flags live in dedicated child
-- tables.

CREATE TABLE grace_score_for_acute_coronary_syndrome (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('emergency-physician', 'acute-physician', 'cardiologist', 'nurse', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-medical-unit', 'coronary-care-unit', 'cardiology-ward', 'other', '')),
    presentation_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (presentation_type IN ('nstemi', 'unstable-angina', 'stemi', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: heart rate (variable 2)
    heart_rate INT,

    -- Step 4: systolic blood pressure (variable 3)
    systolic_blood_pressure INT,

    -- Step 5: serum creatinine (variable 4)
    serum_creatinine NUMERIC(6,2),
    serum_creatinine_unit VARCHAR(10) NOT NULL DEFAULT '' CHECK (serum_creatinine_unit IN ('mg/dL', 'umol/L', '')),

    -- Step 6: Killip class (variable 5)
    killip_class VARCHAR(3) NOT NULL DEFAULT '' CHECK (killip_class IN ('I', 'II', 'III', 'IV', '')),

    -- Step 7: cardiac arrest at admission (variable 6)
    cardiac_arrest_at_admission VARCHAR(3) NOT NULL DEFAULT '' CHECK (cardiac_arrest_at_admission IN ('yes', 'no', '')),

    -- Step 8: ST-segment deviation (variable 7)
    st_segment_deviation VARCHAR(3) NOT NULL DEFAULT '' CHECK (st_segment_deviation IN ('yes', 'no', '')),

    -- Step 9: elevated cardiac enzymes / troponin (variable 8)
    elevated_cardiac_enzymes VARCHAR(3) NOT NULL DEFAULT '' CHECK (elevated_cardiac_enzymes IN ('yes', 'no', '')),

    -- Step 10: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX grace_score_for_acute_coronary_syndrome_patient_id_idx
    ON grace_score_for_acute_coronary_syndrome (patient_id);
CREATE INDEX grace_score_for_acute_coronary_syndrome_clinician_id_idx
    ON grace_score_for_acute_coronary_syndrome (clinician_id);

CREATE TRIGGER trigger_grace_score_for_acute_coronary_syndrome_updated_at
    BEFORE UPDATE ON grace_score_for_acute_coronary_syndrome
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grace_score_for_acute_coronary_syndrome IS
    'Main GRACE assessment record: assessment context, patient identification, and the eight GRACE variable inputs (age, heart rate, systolic blood pressure, serum creatinine, Killip class, cardiac arrest at admission, ST-segment deviation, elevated cardiac enzymes).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician_role IS
    'Role of the assessing clinician: emergency-physician, acute-physician, cardiologist, nurse, or other.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.care_setting IS
    'Care setting: emergency-department, acute-medical-unit, coronary-care-unit, cardiology-ward, or other.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.presentation_type IS
    'Acute coronary syndrome presentation: nstemi, unstable-angina, or stemi.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.age_years IS
    'Variable 1 — patient age in whole years.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.heart_rate IS
    'Variable 2 — admission heart rate in beats per minute.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.systolic_blood_pressure IS
    'Variable 3 — admission systolic blood pressure in mmHg (inverse weight: lower pressure scores higher).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.serum_creatinine IS
    'Variable 4 — measured serum creatinine (raw value; unit held separately). Normalised to mg/dL before banding.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.serum_creatinine_unit IS
    'Unit for the serum creatinine value: mg/dL or umol/L (umol/L divided by 88.4 to obtain mg/dL).';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.killip_class IS
    'Variable 5 — Killip class of heart-failure severity: I, II, III, or IV.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.cardiac_arrest_at_admission IS
    'Variable 6 — cardiac arrest at admission: yes or no.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.st_segment_deviation IS
    'Variable 7 — ST-segment deviation on the admission ECG: yes or no.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.elevated_cardiac_enzymes IS
    'Variable 8 — elevated cardiac enzymes / troponin: yes or no.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
