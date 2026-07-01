-- Main 4AT assessment record: patient and assessment identification,
-- context, and the four scored item inputs (alertness, AMT4, attention
-- via months-backwards, and acute change or fluctuating course). The
-- computed grade, fired rules, and flags live in dedicated child
-- tables.

CREATE TABLE four_a_test_for_delirium (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: patient and assessment identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    patient_name VARCHAR(255) NOT NULL DEFAULT '',
    date_of_birth DATE,
    assessment_date DATE,
    assessment_time TIME,
    setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (setting IN ('acute', 'ed', 'periop', 'careHome', 'community', 'other', '')),
    assessor_name VARCHAR(255) NOT NULL DEFAULT '',
    assessor_role VARCHAR(100) NOT NULL DEFAULT '',

    -- Step 2: item 1 — alertness
    alertness VARCHAR(20) NOT NULL DEFAULT '' CHECK (alertness IN ('normal', 'mildTransient', 'abnormal', '')),

    -- Step 3: item 2 — AMT4 (age, date of birth, place, current year)
    amt4 VARCHAR(30) NOT NULL DEFAULT '' CHECK (amt4 IN ('noMistakes', 'oneMistake', 'twoOrMoreOrUntestable', '')),

    -- Step 4: item 3 — attention (months of the year backwards)
    attention_months VARCHAR(40) NOT NULL DEFAULT '' CHECK (attention_months IN ('sevenOrMore', 'startsButUnderSevenOrRefuses', 'untestable', '')),

    -- Step 5: item 4 — acute change or fluctuating course
    acute_change VARCHAR(10) NOT NULL DEFAULT '' CHECK (acute_change IN ('no', 'yes', '')),
    acute_change_source VARCHAR(20) NOT NULL DEFAULT '' CHECK (acute_change_source IN ('patient', 'collateral', 'records', 'none', '')),

    -- Step 6: summary and sign-off
    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX four_a_test_for_delirium_patient_id_idx
    ON four_a_test_for_delirium (patient_id);
CREATE INDEX four_a_test_for_delirium_clinician_id_idx
    ON four_a_test_for_delirium (clinician_id);

CREATE TRIGGER trigger_four_a_test_for_delirium_updated_at
    BEFORE UPDATE ON four_a_test_for_delirium
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE four_a_test_for_delirium IS
    'Main 4AT assessment record: patient and assessment identification, context, and the four scored item inputs (alertness, AMT4, attention via months-backwards, and acute change or fluctuating course).';
COMMENT ON COLUMN four_a_test_for_delirium.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN four_a_test_for_delirium.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN four_a_test_for_delirium.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN four_a_test_for_delirium.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN four_a_test_for_delirium.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN four_a_test_for_delirium.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN four_a_test_for_delirium.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN four_a_test_for_delirium.patient_name IS
    'Patient name as recorded on the assessment.';
COMMENT ON COLUMN four_a_test_for_delirium.date_of_birth IS
    'Patient date of birth as recorded on the assessment.';
COMMENT ON COLUMN four_a_test_for_delirium.assessment_date IS
    'Date the 4AT assessment was performed.';
COMMENT ON COLUMN four_a_test_for_delirium.assessment_time IS
    'Time of day the 4AT assessment was performed.';
COMMENT ON COLUMN four_a_test_for_delirium.setting IS
    'Care setting: acute, ed (emergency department), periop, careHome, community, or other.';
COMMENT ON COLUMN four_a_test_for_delirium.assessor_name IS
    'Name of the practitioner who completed the assessment.';
COMMENT ON COLUMN four_a_test_for_delirium.assessor_role IS
    'Free-text role of the practitioner who completed the assessment.';
COMMENT ON COLUMN four_a_test_for_delirium.alertness IS
    'Item 1 — observed alertness: normal, mildTransient (brief sleepiness then normal), or abnormal (markedly drowsy or agitated).';
COMMENT ON COLUMN four_a_test_for_delirium.amt4 IS
    'Item 2 — AMT4 mistake band across age, date of birth, place, and current year: noMistakes, oneMistake, or twoOrMoreOrUntestable.';
COMMENT ON COLUMN four_a_test_for_delirium.attention_months IS
    'Item 3 — attention via reciting the months backwards: sevenOrMore correct, startsButUnderSevenOrRefuses, or untestable.';
COMMENT ON COLUMN four_a_test_for_delirium.acute_change IS
    'Item 4 — presence of acute change or fluctuating course over the last 2 weeks still evident in the last 24 hours: no or yes.';
COMMENT ON COLUMN four_a_test_for_delirium.acute_change_source IS
    'Source of the item 4 acute-change information: patient, collateral, records, or none.';
COMMENT ON COLUMN four_a_test_for_delirium.clinical_notes IS
    'Free-text clinical note recorded with the assessment.';
