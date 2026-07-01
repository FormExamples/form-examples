-- Main Edinburgh Postnatal Depression Scale assessment record:
-- assessment context, respondent identification, and the ten
-- item responses. Each item stores the already-reverse-corrected
-- score 0-3 (higher = more symptomatic). The computed total, band,
-- fired rules, and safety flags live in dedicated child tables.

CREATE TABLE edinburgh_postnatal_depression_scale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('midwife', 'health-visitor', 'gp', 'perinatal-mh', 'other', '')),
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('maternity', 'community', 'general-practice', 'perinatal-mh', 'other', '')),
    assessed_at TIMESTAMPTZ,
    perinatal_stage VARCHAR(20) NOT NULL DEFAULT '' CHECK (perinatal_stage IN ('antenatal', 'postnatal', '')),
    perinatal_week NUMERIC(4,1),

    -- Step 2: respondent identification
    respondent_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('under-20', '20-29', '30-39', '40-plus', '')),
    preferred_language VARCHAR(100) NOT NULL DEFAULT '',
    assistance_needed VARCHAR(20) NOT NULL DEFAULT '' CHECK (assistance_needed IN ('none', 'interpreter', 'clinician-read', 'other', '')),

    -- Steps 3-12: the ten item responses (already-reverse-corrected 0-3 scores)
    item_1 SMALLINT CHECK (item_1 BETWEEN 0 AND 3),
    item_2 SMALLINT CHECK (item_2 BETWEEN 0 AND 3),
    item_3 SMALLINT CHECK (item_3 BETWEEN 0 AND 3),
    item_4 SMALLINT CHECK (item_4 BETWEEN 0 AND 3),
    item_5 SMALLINT CHECK (item_5 BETWEEN 0 AND 3),
    item_6 SMALLINT CHECK (item_6 BETWEEN 0 AND 3),
    item_7 SMALLINT CHECK (item_7 BETWEEN 0 AND 3),
    item_8 SMALLINT CHECK (item_8 BETWEEN 0 AND 3),
    item_9 SMALLINT CHECK (item_9 BETWEEN 0 AND 3),
    item_10 SMALLINT CHECK (item_10 BETWEEN 0 AND 3),

    -- Step 13: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX edinburgh_postnatal_depression_scale_patient_id_idx
    ON edinburgh_postnatal_depression_scale (patient_id);
CREATE INDEX edinburgh_postnatal_depression_scale_clinician_id_idx
    ON edinburgh_postnatal_depression_scale (clinician_id);

CREATE TRIGGER trigger_edinburgh_postnatal_depression_scale_updated_at
    BEFORE UPDATE ON edinburgh_postnatal_depression_scale
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE edinburgh_postnatal_depression_scale IS
    'Main EPDS assessment record: assessment context, respondent identification, and the ten already-reverse-corrected item responses (0-3 each, higher = more symptomatic).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician_id IS
    'Foreign key to the administering clinician (optional; delete restricted).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician_name IS
    'Name of the administering clinician as recorded on the assessment.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinician_role IS
    'Role of the administering clinician: midwife, health-visitor, gp, perinatal-mh, or other.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.care_setting IS
    'Care setting: maternity, community, general-practice, perinatal-mh, or other.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.perinatal_stage IS
    'Perinatal stage at assessment: antenatal or postnatal.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.perinatal_week IS
    'Gestational week (antenatal) or postnatal week at assessment.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.respondent_identifier IS
    'Local respondent identifier as recorded on the assessment.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.age_band IS
    'Respondent age band: under-20, 20-29, 30-39, or 40-plus.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.preferred_language IS
    'Language the EPDS was completed in.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.assistance_needed IS
    'Assistance used to complete the EPDS: none, interpreter, clinician-read, or other.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_1 IS
    'Item 1 (able to laugh, normal-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_2 IS
    'Item 2 (looked forward with enjoyment, normal-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_3 IS
    'Item 3 (blamed myself unnecessarily, reverse-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_4 IS
    'Item 4 (anxious or worried, normal-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_5 IS
    'Item 5 (scared or panicky, reverse-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_6 IS
    'Item 6 (things getting on top of me, reverse-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_7 IS
    'Item 7 (unhappy, difficulty sleeping, reverse-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_8 IS
    'Item 8 (sad or miserable, reverse-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_9 IS
    'Item 9 (so unhappy, crying, reverse-scored) response 0-3; NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.item_10 IS
    'Item 10 (thoughts of self-harm, reverse-scored) response 0-3; any value > 0 raises the mandatory self-harm safety flag. NULL when unanswered.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
