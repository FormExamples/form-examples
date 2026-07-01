-- Main Rockall assessment record: assessment context, patient
-- identification, the three clinical parameter inputs (age, shock
-- derived from systolic blood pressure and pulse, comorbidity), and
-- the two endoscopic parameter inputs (diagnosis, stigmata of recent
-- haemorrhage) recorded only when endoscopy has been performed. The
-- computed grade, fired rules, and flags live in dedicated child
-- tables.

CREATE TABLE rockall_score_for_upper_gastrointestinal_bleeding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'gastroenterologist', 'endoscopist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'ward', 'endoscopy-unit', 'other', '')),
    presenting_complaint TEXT NOT NULL DEFAULT '',

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: shock — derived from the two vital signs (clinical parameter)
    systolic_blood_pressure_mmhg INT,
    heart_rate_bpm INT,

    -- Step 4: comorbidity (clinical parameter)
    comorbidity VARCHAR(20) NOT NULL DEFAULT '' CHECK (comorbidity IN ('none', 'major', 'severe', '')),

    -- Step 5: endoscopy gate
    endoscopy_performed VARCHAR(10) NOT NULL DEFAULT '' CHECK (endoscopy_performed IN ('yes', 'no', '')),

    -- Step 6: diagnosis (endoscopic parameter; full score only)
    diagnosis VARCHAR(30) NOT NULL DEFAULT '' CHECK (diagnosis IN ('mallory-weiss-or-none', 'all-other', 'upper-gi-malignancy', '')),

    -- Step 7: stigmata of recent haemorrhage (endoscopic parameter; full score only)
    stigmata_recent_haemorrhage VARCHAR(20) NOT NULL DEFAULT '' CHECK (stigmata_recent_haemorrhage IN ('none-or-dark-spot', 'high-risk', '')),

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX rockall_score_for_upper_gastrointestinal_bleeding_patient_id_idx
    ON rockall_score_for_upper_gastrointestinal_bleeding (patient_id);
CREATE INDEX rockall_score_for_upper_gastrointestinal_bleeding_clinician_id_idx
    ON rockall_score_for_upper_gastrointestinal_bleeding (clinician_id);

CREATE TRIGGER trigger_rockall_score_for_upper_gastrointestinal_bleeding_updated_at
    BEFORE UPDATE ON rockall_score_for_upper_gastrointestinal_bleeding
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE rockall_score_for_upper_gastrointestinal_bleeding IS
    'Main Rockall assessment record: assessment context, patient identification, the three clinical parameter inputs (age, shock, comorbidity), and the two endoscopic parameter inputs (diagnosis, stigmata of recent haemorrhage).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, gastroenterologist, endoscopist, or other.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.care_setting IS
    'Care setting: emergency-department, ward, endoscopy-unit, or other.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.presenting_complaint IS
    'Presenting complaint free text (e.g. haematemesis, melaena, coffee-ground vomiting).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.age_years IS
    'Clinical parameter — patient age in whole years; scores 0 (<60), 1 (60-79), or 2 (>=80).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.systolic_blood_pressure_mmhg IS
    'Clinical parameter (shock) — systolic blood pressure in mmHg; SBP < 100 scores 2 (hypotension).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.heart_rate_bpm IS
    'Clinical parameter (shock) — pulse in beats per minute; HR >= 100 scores 1 (tachycardia) when not hypotensive.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.comorbidity IS
    'Clinical parameter — comorbidity: none (0), major (cardiac failure / ischaemic heart disease / any major comorbidity, 2), or severe (renal failure / liver failure / disseminated malignancy, 3).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.endoscopy_performed IS
    'Whether endoscopy has been performed (yes / no); gates computation of the full post-endoscopy score.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.diagnosis IS
    'Endoscopic parameter (full score only) — diagnosis: mallory-weiss-or-none (0), all-other (1), or upper-gi-malignancy (2).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.stigmata_recent_haemorrhage IS
    'Endoscopic parameter (full score only) — stigmata of recent haemorrhage: none-or-dark-spot (0) or high-risk (blood in upper GI tract, adherent clot, or visible / spurting vessel, 2).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
