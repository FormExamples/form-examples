-- Flagged issues raised independently of the burden bands, with a priority
-- and a suggested action for the reviewing clinician.

CREATE TABLE structured_medication_review_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    structured_medication_review_grade_id UUID NOT NULL
        REFERENCES structured_medication_review_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-acb',
            'stopp-trigger',
            'start-omission',
            'missing-monitoring',
            'adherence-concern',
            'high-risk-no-indication',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX structured_medication_review_grade_flag_grade_id_idx
    ON structured_medication_review_grade_flag (structured_medication_review_grade_id);

CREATE TRIGGER trigger_structured_medication_review_grade_flag_updated_at
    BEFORE UPDATE ON structured_medication_review_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE structured_medication_review_grade_flag IS
    'Flagged issues raised independently of the burden bands, with priority and a suggested action for the reviewing clinician.';
COMMENT ON COLUMN structured_medication_review_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN structured_medication_review_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN structured_medication_review_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN structured_medication_review_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN structured_medication_review_grade_flag.structured_medication_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN structured_medication_review_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-ACB-001).';
COMMENT ON COLUMN structured_medication_review_grade_flag.category IS
    'Flag category: high-acb, stopp-trigger, start-omission, missing-monitoring, adherence-concern, high-risk-no-indication, incomplete, or other.';
COMMENT ON COLUMN structured_medication_review_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN structured_medication_review_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN structured_medication_review_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "review sedating and anticholinergic medicines").';
