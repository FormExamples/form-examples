-- Main bowel-cancer-screening FIT record: one home faecal immunochemical test
-- (FIT) kit outcome under the NHS Bowel Cancer Screening Programme. Captures
-- review context, participant identification, eligibility and invitation, kit
-- return and sample adequacy, the measured faecal haemoglobin concentration and
-- the programme threshold, and red-flag symptoms. The computed result
-- classification, the audit trail of fired rules, and the safety flags live in
-- dedicated child tables. This is a documentation and result-classification
-- record, not a diagnostic test.

CREATE TABLE bowel_cancer_screening_fit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Review context and identification
    reviewed_at TIMESTAMPTZ,
    screening_hub VARCHAR(200) NOT NULL DEFAULT '',
    participant_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age INTEGER,

    -- Eligibility and invitation
    within_age_range VARCHAR(25) NOT NULL DEFAULT '' CHECK (within_age_range IN ('eligible', 'over-age-self-request', 'not-eligible', '')),
    recall_interval VARCHAR(15) NOT NULL DEFAULT '' CHECK (recall_interval IN ('two-yearly', 'other', '')),
    invitation_date DATE,
    previous_outcome VARCHAR(20) NOT NULL DEFAULT '' CHECK (previous_outcome IN ('first-invitation', 'prior-negative', 'prior-positive', 'unknown', '')),
    last_screen_date DATE,

    -- Kit return and adequacy
    kit_returned VARCHAR(5) NOT NULL DEFAULT '' CHECK (kit_returned IN ('yes', 'no', '')),
    return_date DATE,
    sample_adequacy VARCHAR(15) NOT NULL DEFAULT '' CHECK (sample_adequacy IN ('adequate', 'spoilt', 'insufficient', 'expired', '')),
    spoilt_reason VARCHAR(15) NOT NULL DEFAULT '' CHECK (spoilt_reason IN ('leaked', 'undated', 'unlabelled', 'too-old', 'damaged', '')),

    -- FIT result
    faecal_haemoglobin_ug_g NUMERIC(8,1),
    assay VARCHAR(200) NOT NULL DEFAULT '',
    threshold_applied NUMERIC(8,1) DEFAULT 120,

    -- Symptoms
    red_flag_symptoms VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_symptoms IN ('yes', 'no', '')),
    clinical_note TEXT NOT NULL DEFAULT '',

    -- Free-text clinical context
    context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX bowel_cancer_screening_fit_patient_id_idx
    ON bowel_cancer_screening_fit (patient_id);
CREATE INDEX bowel_cancer_screening_fit_clinician_id_idx
    ON bowel_cancer_screening_fit (clinician_id);

CREATE TRIGGER trigger_bowel_cancer_screening_fit_updated_at
    BEFORE UPDATE ON bowel_cancer_screening_fit
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bowel_cancer_screening_fit IS
    'Main bowel-cancer-screening FIT record for one home faecal immunochemical test kit outcome: review context, participant identification, eligibility and invitation, kit return and sample adequacy, the measured faecal haemoglobin concentration and programme threshold, and red-flag symptoms. Result classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN bowel_cancer_screening_fit.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bowel_cancer_screening_fit.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN bowel_cancer_screening_fit.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN bowel_cancer_screening_fit.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN bowel_cancer_screening_fit.patient_id IS
    'Foreign key to the participant this screening documents (restrict delete).';
COMMENT ON COLUMN bowel_cancer_screening_fit.clinician_id IS
    'Foreign key to the reviewing clinician or administrator (restrict delete); optional.';
COMMENT ON COLUMN bowel_cancer_screening_fit.reviewed_at IS
    'Date and time the FIT result was reviewed.';
COMMENT ON COLUMN bowel_cancer_screening_fit.screening_hub IS
    'Screening hub or centre name that processed the kit.';
COMMENT ON COLUMN bowel_cancer_screening_fit.participant_identifier IS
    'Local participant or episode identifier as recorded on the record.';
COMMENT ON COLUMN bowel_cancer_screening_fit.age IS
    'Participant age in years; drives eligibility for the programme age range.';
COMMENT ON COLUMN bowel_cancer_screening_fit.within_age_range IS
    'Eligibility against the programme age range: eligible, over-age-self-request, or not-eligible.';
COMMENT ON COLUMN bowel_cancer_screening_fit.recall_interval IS
    'Routine recall interval: two-yearly (standard programme) or other.';
COMMENT ON COLUMN bowel_cancer_screening_fit.invitation_date IS
    'Date the FIT kit was issued to the participant.';
COMMENT ON COLUMN bowel_cancer_screening_fit.previous_outcome IS
    'Outcome of the previous screening round: first-invitation, prior-negative, prior-positive, or unknown.';
COMMENT ON COLUMN bowel_cancer_screening_fit.last_screen_date IS
    'Date of the most recent previous screening, when known.';
COMMENT ON COLUMN bowel_cancer_screening_fit.kit_returned IS
    'Whether the FIT kit was returned (yes/no); no yields a repeat-kit management action and a non-return flag.';
COMMENT ON COLUMN bowel_cancer_screening_fit.return_date IS
    'Date the completed sample was received.';
COMMENT ON COLUMN bowel_cancer_screening_fit.sample_adequacy IS
    'Sample adequacy: adequate, spoilt, insufficient, or expired; anything other than adequate classifies as spoilt and is repeated.';
COMMENT ON COLUMN bowel_cancer_screening_fit.spoilt_reason IS
    'Reason a sample was spoilt or inadequate: leaked, undated, unlabelled, too-old, or damaged.';
COMMENT ON COLUMN bowel_cancer_screening_fit.faecal_haemoglobin_ug_g IS
    'Measured faecal haemoglobin concentration in micrograms of haemoglobin per gram of faeces (ug Hb/g).';
COMMENT ON COLUMN bowel_cancer_screening_fit.assay IS
    'Analyser or assay identifier used to measure the faecal haemoglobin concentration.';
COMMENT ON COLUMN bowel_cancer_screening_fit.threshold_applied IS
    'Programme threshold in ug Hb/g at or above which the result is positive; defaults to 120 (screening); 10 yields NICE DG56 symptomatic behaviour.';
COMMENT ON COLUMN bowel_cancer_screening_fit.red_flag_symptoms IS
    'Whether the participant reports red-flag symptoms (yes/no); yes sets the symptomatic pathway independently of the FIT result.';
COMMENT ON COLUMN bowel_cancer_screening_fit.clinical_note IS
    'Free-text clinical note.';
COMMENT ON COLUMN bowel_cancer_screening_fit.context IS
    'Optional free-text clinical context shown in the summary.';
