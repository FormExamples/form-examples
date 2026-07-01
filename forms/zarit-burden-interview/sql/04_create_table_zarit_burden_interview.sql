-- Main Zarit Burden Interview record: assessment context, the carer and
-- care-recipient identification, and the twenty-two item ratings (each on
-- a 0-4 frequency scale). The computed total, burden band, fired items,
-- and flags live in dedicated child tables.

CREATE TABLE zarit_burden_interview (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Assessment context
    practitioner_name VARCHAR(255) NOT NULL DEFAULT '',
    practitioner_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (practitioner_role IN ('clinician', 'nurse', 'social-care', 'carer-support', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('memory-service', 'community', 'general-practice', 'social-care', 'other', '')),
    instrument_form VARCHAR(10) NOT NULL DEFAULT 'zbi22' CHECK (instrument_form IN ('zbi22', 'zbi12')),

    -- Carer (the person completing the questionnaire)
    carer_identifier VARCHAR(100) NOT NULL DEFAULT '',
    carer_relationship VARCHAR(20) NOT NULL DEFAULT '' CHECK (carer_relationship IN ('spouse-partner', 'adult-child', 'other-relative', 'friend', 'other', '')),
    carer_co_resident VARCHAR(10) NOT NULL DEFAULT '' CHECK (carer_co_resident IN ('yes', 'no', '')),
    care_hours_per_week NUMERIC(5,1),

    -- Care recipient (context beyond the patient entity)
    recipient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    recipient_condition VARCHAR(20) NOT NULL DEFAULT '' CHECK (recipient_condition IN ('dementia', 'chronic-illness', 'disability', 'other', '')),

    -- Item ratings: each 0-4 on the frequency scale, or NULL when unanswered
    item_1  SMALLINT CHECK (item_1  BETWEEN 0 AND 4),
    item_2  SMALLINT CHECK (item_2  BETWEEN 0 AND 4),
    item_3  SMALLINT CHECK (item_3  BETWEEN 0 AND 4),
    item_4  SMALLINT CHECK (item_4  BETWEEN 0 AND 4),
    item_5  SMALLINT CHECK (item_5  BETWEEN 0 AND 4),
    item_6  SMALLINT CHECK (item_6  BETWEEN 0 AND 4),
    item_7  SMALLINT CHECK (item_7  BETWEEN 0 AND 4),
    item_8  SMALLINT CHECK (item_8  BETWEEN 0 AND 4),
    item_9  SMALLINT CHECK (item_9  BETWEEN 0 AND 4),
    item_10 SMALLINT CHECK (item_10 BETWEEN 0 AND 4),
    item_11 SMALLINT CHECK (item_11 BETWEEN 0 AND 4),
    item_12 SMALLINT CHECK (item_12 BETWEEN 0 AND 4),
    item_13 SMALLINT CHECK (item_13 BETWEEN 0 AND 4),
    item_14 SMALLINT CHECK (item_14 BETWEEN 0 AND 4),
    item_15 SMALLINT CHECK (item_15 BETWEEN 0 AND 4),
    item_16 SMALLINT CHECK (item_16 BETWEEN 0 AND 4),
    item_17 SMALLINT CHECK (item_17 BETWEEN 0 AND 4),
    item_18 SMALLINT CHECK (item_18 BETWEEN 0 AND 4),
    item_19 SMALLINT CHECK (item_19 BETWEEN 0 AND 4),
    item_20 SMALLINT CHECK (item_20 BETWEEN 0 AND 4),
    item_21 SMALLINT CHECK (item_21 BETWEEN 0 AND 4),
    item_22 SMALLINT CHECK (item_22 BETWEEN 0 AND 4),

    -- Clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX zarit_burden_interview_patient_id_idx
    ON zarit_burden_interview (patient_id);
CREATE INDEX zarit_burden_interview_clinician_id_idx
    ON zarit_burden_interview (clinician_id);

CREATE TRIGGER trigger_zarit_burden_interview_updated_at
    BEFORE UPDATE ON zarit_burden_interview
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE zarit_burden_interview IS
    'Main Zarit Burden Interview record: assessment context, carer and care-recipient identification, and the twenty-two 0-4 item ratings.';
COMMENT ON COLUMN zarit_burden_interview.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN zarit_burden_interview.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN zarit_burden_interview.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN zarit_burden_interview.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN zarit_burden_interview.patient_id IS
    'Foreign key to the care recipient being cared for (delete restricted).';
COMMENT ON COLUMN zarit_burden_interview.clinician_id IS
    'Foreign key to the administering practitioner (optional; delete restricted).';
COMMENT ON COLUMN zarit_burden_interview.practitioner_name IS
    'Name of the administering practitioner as recorded on the assessment.';
COMMENT ON COLUMN zarit_burden_interview.practitioner_role IS
    'Role of the administering practitioner: clinician, nurse, social-care, carer-support, or other.';
COMMENT ON COLUMN zarit_burden_interview.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN zarit_burden_interview.care_setting IS
    'Care setting: memory-service, community, general-practice, social-care, or other.';
COMMENT ON COLUMN zarit_burden_interview.instrument_form IS
    'Which item set is scored: zbi22 (full 22-item, default) or zbi12 (12-item short form).';
COMMENT ON COLUMN zarit_burden_interview.carer_identifier IS
    'Local identifier for the carer completing the questionnaire.';
COMMENT ON COLUMN zarit_burden_interview.carer_relationship IS
    'Carer relationship to the care recipient: spouse-partner, adult-child, other-relative, friend, or other.';
COMMENT ON COLUMN zarit_burden_interview.carer_co_resident IS
    'Whether the carer lives with the care recipient: yes or no.';
COMMENT ON COLUMN zarit_burden_interview.care_hours_per_week IS
    'Approximate hours of care provided per week.';
COMMENT ON COLUMN zarit_burden_interview.recipient_identifier IS
    'Local identifier for the care recipient.';
COMMENT ON COLUMN zarit_burden_interview.recipient_condition IS
    'Primary condition of the care recipient: dementia, chronic-illness, disability, or other.';
COMMENT ON COLUMN zarit_burden_interview.item_1 IS
    'Item 1 rating (0-4): feel asked to do more than you should for the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_2 IS
    'Item 2 rating (0-4): not enough time for yourself.';
COMMENT ON COLUMN zarit_burden_interview.item_3 IS
    'Item 3 rating (0-4): stressed between caring and other responsibilities.';
COMMENT ON COLUMN zarit_burden_interview.item_4 IS
    'Item 4 rating (0-4): embarrassed by the relative''s behaviour.';
COMMENT ON COLUMN zarit_burden_interview.item_5 IS
    'Item 5 rating (0-4): angry when around the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_6 IS
    'Item 6 rating (0-4): relative affects your relationships with others negatively.';
COMMENT ON COLUMN zarit_burden_interview.item_7 IS
    'Item 7 rating (0-4): afraid about what the future holds for the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_8 IS
    'Item 8 rating (0-4): the relative is dependent on you.';
COMMENT ON COLUMN zarit_burden_interview.item_9 IS
    'Item 9 rating (0-4): strained when around the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_10 IS
    'Item 10 rating (0-4): your health has suffered because of caring.';
COMMENT ON COLUMN zarit_burden_interview.item_11 IS
    'Item 11 rating (0-4): not as much privacy as you would like.';
COMMENT ON COLUMN zarit_burden_interview.item_12 IS
    'Item 12 rating (0-4): social life has suffered.';
COMMENT ON COLUMN zarit_burden_interview.item_13 IS
    'Item 13 rating (0-4): uncomfortable having friends over because of the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_14 IS
    'Item 14 rating (0-4): relative expects you to care as the only one they can depend on.';
COMMENT ON COLUMN zarit_burden_interview.item_15 IS
    'Item 15 rating (0-4): not enough money to care in addition to other expenses.';
COMMENT ON COLUMN zarit_burden_interview.item_16 IS
    'Item 16 rating (0-4): unable to care for the relative much longer.';
COMMENT ON COLUMN zarit_burden_interview.item_17 IS
    'Item 17 rating (0-4): lost control of your life since the relative''s illness.';
COMMENT ON COLUMN zarit_burden_interview.item_18 IS
    'Item 18 rating (0-4): wish you could leave the care to someone else.';
COMMENT ON COLUMN zarit_burden_interview.item_19 IS
    'Item 19 rating (0-4): uncertain about what to do for the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_20 IS
    'Item 20 rating (0-4): feel you should be doing more for the relative.';
COMMENT ON COLUMN zarit_burden_interview.item_21 IS
    'Item 21 rating (0-4): feel you could do a better job caring.';
COMMENT ON COLUMN zarit_burden_interview.item_22 IS
    'Item 22 rating (0-4): global burden — overall how burdened you feel caring.';
COMMENT ON COLUMN zarit_burden_interview.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
