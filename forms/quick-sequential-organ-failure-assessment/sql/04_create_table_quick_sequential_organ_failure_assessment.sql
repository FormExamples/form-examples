-- Main qSOFA assessment record: assessment context, patient
-- identification, and the three scored criterion inputs (respiratory
-- rate, mentation, systolic blood pressure). The computed grade, fired
-- rules, and flags live in dedicated child tables.

CREATE TABLE quick_sequential_organ_failure_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'paramedic', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'ward', 'pre-hospital', 'other', '')),
    suspected_source TEXT NOT NULL DEFAULT '',

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: respiratory rate (criterion 1) — positive when >= 22 breaths/min
    respiratory_rate NUMERIC(4,1),

    -- Step 4: mentation (criterion 2) — GCS < 15, or altered-mentation fallback when GCS unavailable
    glasgow_coma_scale INT,
    mentation_altered VARCHAR(10) NOT NULL DEFAULT '' CHECK (mentation_altered IN ('yes', 'no', '')),

    -- Step 5: systolic blood pressure (criterion 3) — positive when <= 100 mmHg
    systolic_blood_pressure NUMERIC(4,1),

    -- Step 6: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX quick_sequential_organ_failure_assessment_patient_id_idx
    ON quick_sequential_organ_failure_assessment (patient_id);
CREATE INDEX quick_sequential_organ_failure_assessment_clinician_id_idx
    ON quick_sequential_organ_failure_assessment (clinician_id);

CREATE TRIGGER trigger_quick_sequential_organ_failure_assessment_updated_at
    BEFORE UPDATE ON quick_sequential_organ_failure_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE quick_sequential_organ_failure_assessment IS
    'Main qSOFA assessment record: assessment context, patient identification, and the three scored criterion inputs (respiratory rate, mentation, systolic blood pressure).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, paramedic, or other.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.care_setting IS
    'Care setting: emergency-department, ward, pre-hospital, or other.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.suspected_source IS
    'Suspected or confirmed infection source recorded with the assessment.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.respiratory_rate IS
    'Criterion 1 — measured respiratory rate in breaths per minute; scores 1 point when >= 22.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.glasgow_coma_scale IS
    'Criterion 2 — Glasgow Coma Scale total (3-15); scores 1 point when < 15.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.mentation_altered IS
    'Criterion 2 — altered-mentation flag (yes/no); scores the mentation point at the bedside when a formal GCS is unavailable.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.systolic_blood_pressure IS
    'Criterion 3 — measured systolic blood pressure in mmHg; scores 1 point when <= 100.';
COMMENT ON COLUMN quick_sequential_organ_failure_assessment.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
