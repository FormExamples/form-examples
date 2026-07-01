-- Main CAGE alcohol questionnaire record: assessment context, patient
-- identification, and the four scored criterion inputs (cut down,
-- annoyed, guilty, eye-opener). The computed grade, fired rules, and
-- flags live in dedicated child tables.

CREATE TABLE cage_alcohol_questionnaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'midwife', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('primary-care', 'ward', 'emergency-department', 'antenatal', 'other', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: criterion C — felt you should cut down on drinking
    cut_down VARCHAR(3) NOT NULL DEFAULT '' CHECK (cut_down IN ('yes', 'no', '')),

    -- Step 4: criterion A — people annoyed you by criticising your drinking
    annoyed VARCHAR(3) NOT NULL DEFAULT '' CHECK (annoyed IN ('yes', 'no', '')),

    -- Step 5: criterion G — felt bad or guilty about your drinking
    guilty VARCHAR(3) NOT NULL DEFAULT '' CHECK (guilty IN ('yes', 'no', '')),

    -- Step 6: criterion E — morning drink to steady nerves or cure a hangover
    eye_opener VARCHAR(3) NOT NULL DEFAULT '' CHECK (eye_opener IN ('yes', 'no', '')),

    -- Step 7: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX cage_alcohol_questionnaire_patient_id_idx
    ON cage_alcohol_questionnaire (patient_id);
CREATE INDEX cage_alcohol_questionnaire_clinician_id_idx
    ON cage_alcohol_questionnaire (clinician_id);

CREATE TRIGGER trigger_cage_alcohol_questionnaire_updated_at
    BEFORE UPDATE ON cage_alcohol_questionnaire
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cage_alcohol_questionnaire IS
    'Main CAGE alcohol questionnaire record: assessment context, patient identification, and the four scored criterion inputs (cut down, annoyed, guilty, eye-opener).';
COMMENT ON COLUMN cage_alcohol_questionnaire.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cage_alcohol_questionnaire.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cage_alcohol_questionnaire.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cage_alcohol_questionnaire.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cage_alcohol_questionnaire.patient_id IS
    'Foreign key to the patient being screened (delete restricted).';
COMMENT ON COLUMN cage_alcohol_questionnaire.clinician_id IS
    'Foreign key to the screening clinician (optional; delete restricted).';
COMMENT ON COLUMN cage_alcohol_questionnaire.clinician_name IS
    'Name of the screening clinician as recorded on the assessment.';
COMMENT ON COLUMN cage_alcohol_questionnaire.clinician_role IS
    'Role of the screening clinician: doctor, nurse, midwife, or other.';
COMMENT ON COLUMN cage_alcohol_questionnaire.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN cage_alcohol_questionnaire.care_setting IS
    'Care setting: primary-care, ward, emergency-department, antenatal, or other.';
COMMENT ON COLUMN cage_alcohol_questionnaire.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN cage_alcohol_questionnaire.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN cage_alcohol_questionnaire.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN cage_alcohol_questionnaire.cut_down IS
    'Criterion C — has the patient felt they should cut down on their drinking: yes, no, or unanswered.';
COMMENT ON COLUMN cage_alcohol_questionnaire.annoyed IS
    'Criterion A — have people annoyed the patient by criticising their drinking: yes, no, or unanswered.';
COMMENT ON COLUMN cage_alcohol_questionnaire.guilty IS
    'Criterion G — has the patient felt bad or guilty about their drinking: yes, no, or unanswered.';
COMMENT ON COLUMN cage_alcohol_questionnaire.eye_opener IS
    'Criterion E — has the patient had a morning drink to steady nerves or cure a hangover (eye-opener): yes, no, or unanswered.';
COMMENT ON COLUMN cage_alcohol_questionnaire.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
