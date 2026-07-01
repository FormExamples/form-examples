-- Safety flags raised independently of the completeness status, each with a
-- priority and a suggested action for the anaesthetic team.

CREATE TABLE anaesthetic_record_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anaesthetic_record_grade_id UUID NOT NULL
        REFERENCES anaesthetic_record_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'who-checklist-not-done',
            'allergy-conflict',
            'difficult-airway',
            'drug-anaphylaxis',
            'unlogged-consent',
            'physiological-derangement',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX anaesthetic_record_grade_flag_grade_id_idx
    ON anaesthetic_record_grade_flag (anaesthetic_record_grade_id);

CREATE TRIGGER trigger_anaesthetic_record_grade_flag_updated_at
    BEFORE UPDATE ON anaesthetic_record_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record_grade_flag IS
    'Safety flags raised independently of the completeness status, with priority and a suggested action for the anaesthetic team.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.anaesthetic_record_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-WHO-CHECKLIST-NOT-DONE-001).';
COMMENT ON COLUMN anaesthetic_record_grade_flag.category IS
    'Flag category: who-checklist-not-done, allergy-conflict, difficult-airway, drug-anaphylaxis, unlogged-consent, physiological-derangement, incomplete, or other.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN anaesthetic_record_grade_flag.suggested_action IS
    'Suggested anaesthetic action (e.g. "complete the WHO Time Out before proceeding").';
