-- Safety flags that fire independently of both the completeness status and
-- the acuity band, each with a priority and a suggested action for the
-- clinician or governance team. Flags are never suppressed: a low-priority
-- flag is still rendered.

CREATE TABLE inpatient_clinical_note_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    inpatient_clinical_note_grade_id UUID NOT NULL
        REFERENCES inpatient_clinical_note_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'deteriorating-news2-no-escalation',
            'sepsis-screen-positive-no-action',
            'vte-not-assessed',
            'abnormal-result-not-actioned',
            'no-plan-documented',
            'allergy-not-checked',
            'no-senior-review',
            'ceiling-of-care-undocumented',
            'antimicrobial-review-overdue',
            'no-capacity-assessment',
            'long-stay-no-discharge-plan',
            'incomplete-entry',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX inpatient_clinical_note_grade_flag_grade_id_idx
    ON inpatient_clinical_note_grade_flag (inpatient_clinical_note_grade_id);

CREATE TRIGGER trigger_inpatient_clinical_note_grade_flag_updated_at
    BEFORE UPDATE ON inpatient_clinical_note_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE inpatient_clinical_note_grade_flag IS
    'Safety flags that fire independently of the completeness status and the acuity band, with priority and a suggested action for the clinician or governance team.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.inpatient_clinical_note_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-VTE-NOT-ASSESSED-001).';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.category IS
    'Flag category, one of the twelve defined in the spec, or other.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN inpatient_clinical_note_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "escalate to the senior on call", "complete the VTE assessment").';
