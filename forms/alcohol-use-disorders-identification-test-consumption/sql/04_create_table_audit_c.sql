-- Main AUDIT-C assessment record: assessment context, patient
-- identification, and the three scored consumption item inputs (Q1
-- frequency of drinking, Q2 typical quantity, Q3 frequency of heavy
-- episodic drinking). The computed grade, fired rules, and flags live
-- in dedicated child tables.
--
-- Uses the short table base `audit_c` because the form slug
-- (alcohol-use-disorders-identification-test-consumption) would exceed
-- PostgreSQL's 63-byte identifier limit for derived table, index, and
-- trigger names.

CREATE TABLE audit_c (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('gp', 'nurse', 'healthcare-assistant', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('primary-care', 'emergency-department', 'health-check', 'inpatient', 'other', '')),
    administration_mode VARCHAR(20) NOT NULL DEFAULT '' CHECK (administration_mode IN ('self-completed', 'interview', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-24', '25-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: Q1 — frequency of drinking (item 1); response point value 0-4
    item_1_frequency SMALLINT CHECK (item_1_frequency BETWEEN 0 AND 4),

    -- Step 4: Q2 — typical quantity in UK units on a drinking day (item 2); response point value 0-4
    item_2_quantity SMALLINT CHECK (item_2_quantity BETWEEN 0 AND 4),

    -- Step 5: Q3 — frequency of heavy episodic (binge) drinking (item 3); response point value 0-4
    item_3_binge_frequency SMALLINT CHECK (item_3_binge_frequency BETWEEN 0 AND 4),

    -- Step 6: clinician free-text note
    context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX audit_c_patient_id_idx
    ON audit_c (patient_id);
CREATE INDEX audit_c_clinician_id_idx
    ON audit_c (clinician_id);

CREATE TRIGGER trigger_audit_c_updated_at
    BEFORE UPDATE ON audit_c
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE audit_c IS
    'Main AUDIT-C assessment record: assessment context, patient identification, and the three scored consumption item inputs (Q1 frequency of drinking, Q2 typical quantity, Q3 frequency of heavy episodic drinking). Uses the short table base audit_c to stay within PostgreSQL identifier limits.';
COMMENT ON COLUMN audit_c.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN audit_c.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN audit_c.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN audit_c.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN audit_c.patient_id IS
    'Foreign key to the patient being screened (delete restricted).';
COMMENT ON COLUMN audit_c.clinician_id IS
    'Foreign key to the administering clinician (optional; delete restricted).';
COMMENT ON COLUMN audit_c.clinician_name IS
    'Name of the administering clinician as recorded on the assessment.';
COMMENT ON COLUMN audit_c.clinician_role IS
    'Role of the administering clinician: gp, nurse, healthcare-assistant, or other.';
COMMENT ON COLUMN audit_c.assessed_at IS
    'Date and time the AUDIT-C screen was administered.';
COMMENT ON COLUMN audit_c.care_setting IS
    'Care setting: primary-care, emergency-department, health-check, inpatient, or other.';
COMMENT ON COLUMN audit_c.administration_mode IS
    'How the screen was administered: self-completed by the patient or by interview.';
COMMENT ON COLUMN audit_c.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN audit_c.age_band IS
    'Adult age band: 16-24, 25-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN audit_c.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown. Selects the Q3 heavy-episode threshold (>= 6 units female, >= 8 units male) and the sex-specific low-cut flag.';
COMMENT ON COLUMN audit_c.item_1_frequency IS
    'Q1 (item 1) — chosen response point value (0-4) for how often the patient drinks; null when unanswered.';
COMMENT ON COLUMN audit_c.item_2_quantity IS
    'Q2 (item 2) — chosen response point value (0-4) for the typical number of UK units on a drinking day; null when unanswered.';
COMMENT ON COLUMN audit_c.item_3_binge_frequency IS
    'Q3 (item 3) — chosen response point value (0-4) for how often the patient has a heavy episodic (binge) drinking session; null when unanswered.';
COMMENT ON COLUMN audit_c.context IS
    'Free-text clinical note recorded with the assessment.';
