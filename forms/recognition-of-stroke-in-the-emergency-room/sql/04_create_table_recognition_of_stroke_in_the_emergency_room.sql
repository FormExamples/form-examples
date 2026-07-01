-- Main ROSIER (Recognition of Stroke in the Emergency Room) assessment
-- record: assessment context, patient identification, the blood-glucose
-- precondition, the two mimic-exclusion criteria (loss of consciousness /
-- syncope, seizure activity), and the five acute-onset neurological signs
-- (asymmetric facial / arm / leg weakness, speech disturbance, visual
-- field defect). The computed grade, fired rules, and flags live in
-- dedicated child tables.

CREATE TABLE recognition_of_stroke_in_the_emergency_room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'paramedic', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-medical', 'other', '')),
    symptom_onset_at TIMESTAMPTZ,
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 2: precondition — blood glucose measured before scoring
    blood_glucose NUMERIC(5,1),
    hypoglycaemia_corrected VARCHAR(5) NOT NULL DEFAULT '' CHECK (hypoglycaemia_corrected IN ('yes', 'no', 'na', '')),

    -- Step 3: mimic-exclusion criteria (each scores -1 if yes)
    loss_of_consciousness VARCHAR(5) NOT NULL DEFAULT '' CHECK (loss_of_consciousness IN ('yes', 'no', '')),
    seizure_activity VARCHAR(5) NOT NULL DEFAULT '' CHECK (seizure_activity IN ('yes', 'no', '')),

    -- Step 4: acute-onset neurological signs (each scores +1 if yes)
    facial_weakness VARCHAR(5) NOT NULL DEFAULT '' CHECK (facial_weakness IN ('yes', 'no', '')),
    arm_weakness VARCHAR(5) NOT NULL DEFAULT '' CHECK (arm_weakness IN ('yes', 'no', '')),
    leg_weakness VARCHAR(5) NOT NULL DEFAULT '' CHECK (leg_weakness IN ('yes', 'no', '')),
    speech_disturbance VARCHAR(5) NOT NULL DEFAULT '' CHECK (speech_disturbance IN ('yes', 'no', '')),
    visual_field_defect VARCHAR(5) NOT NULL DEFAULT '' CHECK (visual_field_defect IN ('yes', 'no', '')),

    -- Step 5: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX recognition_of_stroke_in_the_emergency_room_patient_id_idx
    ON recognition_of_stroke_in_the_emergency_room (patient_id);
CREATE INDEX recognition_of_stroke_in_the_emergency_room_clinician_id_idx
    ON recognition_of_stroke_in_the_emergency_room (clinician_id);

CREATE TRIGGER trigger_recognition_of_stroke_in_the_emergency_room_updated_at
    BEFORE UPDATE ON recognition_of_stroke_in_the_emergency_room
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE recognition_of_stroke_in_the_emergency_room IS
    'Main ROSIER assessment record: assessment context, patient identification, the blood-glucose precondition, the two mimic-exclusion criteria, and the five acute-onset neurological signs.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, paramedic, or other.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.care_setting IS
    'Care setting: emergency-department, acute-medical, or other.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.symptom_onset_at IS
    'Reported date and time of symptom onset.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.blood_glucose IS
    'Precondition — blood glucose in mmol/L measured before scoring; a value < 3.5 flags the hypoglycaemia mimic.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.hypoglycaemia_corrected IS
    'Whether hypoglycaemia was corrected before applying the score: yes, no, or na (not applicable).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.loss_of_consciousness IS
    'Criterion 1 — loss of consciousness or syncope (mimic); yes scores -1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.seizure_activity IS
    'Criterion 2 — seizure activity (mimic); yes scores -1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.facial_weakness IS
    'Criterion 3 — asymmetric facial weakness (sign); yes scores +1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.arm_weakness IS
    'Criterion 4 — asymmetric arm weakness (sign); yes scores +1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.leg_weakness IS
    'Criterion 5 — asymmetric leg weakness (sign); yes scores +1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.speech_disturbance IS
    'Criterion 6 — speech disturbance (sign); yes scores +1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.visual_field_defect IS
    'Criterion 7 — visual field defect (sign); yes scores +1.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
