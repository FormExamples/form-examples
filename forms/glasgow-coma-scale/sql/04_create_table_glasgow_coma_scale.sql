-- Main Glasgow Coma Scale assessment record: assessment context,
-- patient identification, confounders, the three component responses
-- (eye, verbal, motor) with their not-testable handling, the pupillary
-- findings for GCS-Pupils, and the trend fields. The computed grade,
-- fired rules, and flags live in dedicated child tables.

CREATE TABLE glasgow_coma_scale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    assessor_name VARCHAR(255) NOT NULL DEFAULT '',
    assessor_role VARCHAR(40) NOT NULL DEFAULT '' CHECK (assessor_role IN ('doctor', 'nurse', 'paramedic', 'emergency-medical-technician', 'advanced-clinical-practitioner', 'neuro-observation-staff', 'other', '')),
    assessed_at TIMESTAMPTZ,
    setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (setting IN ('ed', 'neuro', 'critical-care', 'pre-hospital', 'other', '')),
    reason TEXT NOT NULL DEFAULT '',

    -- Step 2: confounders (each may force a component to NT)
    intubated VARCHAR(5) NOT NULL DEFAULT '' CHECK (intubated IN ('yes', 'no', '')),
    sedated VARCHAR(5) NOT NULL DEFAULT '' CHECK (sedated IN ('yes', 'no', '')),
    paralysed VARCHAR(5) NOT NULL DEFAULT '' CHECK (paralysed IN ('yes', 'no', '')),

    -- Step 3: eye opening (E, 1-4) — descriptor, or NT when not testable
    eye_response VARCHAR(15) NOT NULL DEFAULT '' CHECK (eye_response IN ('spontaneous', 'to-sound', 'to-pressure', 'none', 'NT', '')),
    eye_not_testable_reason TEXT NOT NULL DEFAULT '',

    -- Step 4: verbal response (V, 1-5) — descriptor, or NT when not testable
    verbal_response VARCHAR(15) NOT NULL DEFAULT '' CHECK (verbal_response IN ('orientated', 'confused', 'words', 'sounds', 'none', 'NT', '')),
    verbal_not_testable_reason TEXT NOT NULL DEFAULT '',

    -- Step 5: motor response (M, 1-6) — descriptor, or NT when not testable
    motor_response VARCHAR(20) NOT NULL DEFAULT '' CHECK (motor_response IN ('obeys-commands', 'localising', 'normal-flexion', 'abnormal-flexion', 'extension', 'none', 'NT', '')),
    motor_not_testable_reason TEXT NOT NULL DEFAULT '',

    -- Step 6: pupils (for GCS-Pupils)
    left_pupil_reactivity VARCHAR(15) NOT NULL DEFAULT '' CHECK (left_pupil_reactivity IN ('reactive', 'sluggish', 'unreactive', '')),
    right_pupil_reactivity VARCHAR(15) NOT NULL DEFAULT '' CHECK (right_pupil_reactivity IN ('reactive', 'sluggish', 'unreactive', '')),
    left_pupil_size_mm NUMERIC(3,1),
    right_pupil_size_mm NUMERIC(3,1),

    -- Step 7: trend
    previous_total INT,
    previous_motor_score INT,
    previous_assessed_at TIMESTAMPTZ,

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX glasgow_coma_scale_patient_id_idx
    ON glasgow_coma_scale (patient_id);
CREATE INDEX glasgow_coma_scale_clinician_id_idx
    ON glasgow_coma_scale (clinician_id);

CREATE TRIGGER trigger_glasgow_coma_scale_updated_at
    BEFORE UPDATE ON glasgow_coma_scale
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_coma_scale IS
    'Main Glasgow Coma Scale assessment record: assessment context, patient identification, confounders, the three component responses (eye, verbal, motor) with not-testable handling, pupillary findings for GCS-Pupils, and trend fields.';
COMMENT ON COLUMN glasgow_coma_scale.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_coma_scale.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN glasgow_coma_scale.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN glasgow_coma_scale.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN glasgow_coma_scale.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN glasgow_coma_scale.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN glasgow_coma_scale.assessor_name IS
    'Name of the assessing observer as recorded on the assessment.';
COMMENT ON COLUMN glasgow_coma_scale.assessor_role IS
    'Role of the assessing observer: doctor, nurse, paramedic, emergency-medical-technician, advanced-clinical-practitioner, neuro-observation-staff, or other.';
COMMENT ON COLUMN glasgow_coma_scale.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN glasgow_coma_scale.setting IS
    'Care setting: ed (emergency department), neuro, critical-care, pre-hospital, or other.';
COMMENT ON COLUMN glasgow_coma_scale.reason IS
    'Free-text reason for the assessment (e.g. head injury, stroke, reduced consciousness).';
COMMENT ON COLUMN glasgow_coma_scale.intubated IS
    'Whether the patient is intubated or has a tracheostomy (confounder; may force the verbal component to NT).';
COMMENT ON COLUMN glasgow_coma_scale.sedated IS
    'Whether the patient is sedated (confounder; may force a component to NT).';
COMMENT ON COLUMN glasgow_coma_scale.paralysed IS
    'Whether the patient has neuromuscular blockade (confounder; may force the motor component to NT).';
COMMENT ON COLUMN glasgow_coma_scale.eye_response IS
    'Best eye-opening response (E, 1-4): spontaneous (4), to-sound (3), to-pressure (2), none (1), or NT when a local factor prevents testing.';
COMMENT ON COLUMN glasgow_coma_scale.eye_not_testable_reason IS
    'Free-text reason the eye component is not testable (e.g. periorbital swelling, dressings).';
COMMENT ON COLUMN glasgow_coma_scale.verbal_response IS
    'Best verbal response (V, 1-5): orientated (5), confused (4), words (3), sounds (2), none (1), or NT when a local factor prevents testing.';
COMMENT ON COLUMN glasgow_coma_scale.verbal_not_testable_reason IS
    'Free-text reason the verbal component is not testable (e.g. intubation, tracheostomy, language barrier).';
COMMENT ON COLUMN glasgow_coma_scale.motor_response IS
    'Best motor response (M, 1-6): obeys-commands (6), localising (5), normal-flexion (4), abnormal-flexion (3), extension (2), none (1), or NT when a local factor prevents testing.';
COMMENT ON COLUMN glasgow_coma_scale.motor_not_testable_reason IS
    'Free-text reason the motor component is not testable (e.g. neuromuscular blockade, spinal injury, limb immobilisation).';
COMMENT ON COLUMN glasgow_coma_scale.left_pupil_reactivity IS
    'Left pupil reactivity to light: reactive, sluggish, or unreactive (used for the Pupil Reactivity Score).';
COMMENT ON COLUMN glasgow_coma_scale.right_pupil_reactivity IS
    'Right pupil reactivity to light: reactive, sluggish, or unreactive (used for the Pupil Reactivity Score).';
COMMENT ON COLUMN glasgow_coma_scale.left_pupil_size_mm IS
    'Left pupil size in millimetres (for the record).';
COMMENT ON COLUMN glasgow_coma_scale.right_pupil_size_mm IS
    'Right pupil size in millimetres (for the record).';
COMMENT ON COLUMN glasgow_coma_scale.previous_total IS
    'Previous total GCS (3-15) for the trend comparison, when available.';
COMMENT ON COLUMN glasgow_coma_scale.previous_motor_score IS
    'Previous motor component score (1-6) for the trend comparison, when available.';
COMMENT ON COLUMN glasgow_coma_scale.previous_assessed_at IS
    'Date and time of the previous assessment used for the trend comparison.';
COMMENT ON COLUMN glasgow_coma_scale.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
