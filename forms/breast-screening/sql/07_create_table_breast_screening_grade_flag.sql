-- Safety flags that fire independently of the screening outcome, each with a
-- priority and a suggested action for the reporting clinician or screening
-- service.

CREATE TABLE breast_screening_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    breast_screening_grade_id UUID NOT NULL
        REFERENCES breast_screening_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'symptomatic-wrong-pathway',
            'suspicious-malignant',
            'recall-for-assessment',
            'indeterminate-result',
            'technical-repeat',
            'consent-not-given',
            'outside-age-range',
            'overdue',
            'incomplete-record',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX breast_screening_grade_flag_grade_id_idx
    ON breast_screening_grade_flag (breast_screening_grade_id);

CREATE TRIGGER trigger_breast_screening_grade_flag_updated_at
    BEFORE UPDATE ON breast_screening_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE breast_screening_grade_flag IS
    'Safety flags that fire independently of the screening outcome, with priority and a suggested action for the reporting clinician or screening service.';
COMMENT ON COLUMN breast_screening_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN breast_screening_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN breast_screening_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN breast_screening_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN breast_screening_grade_flag.breast_screening_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN breast_screening_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SUSPICIOUS-MALIGNANT-001).';
COMMENT ON COLUMN breast_screening_grade_flag.category IS
    'Flag category: symptomatic-wrong-pathway, suspicious-malignant, recall-for-assessment, indeterminate-result, technical-repeat, consent-not-given, outside-age-range, overdue, incomplete-record, or other.';
COMMENT ON COLUMN breast_screening_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN breast_screening_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN breast_screening_grade_flag.suggested_action IS
    'Suggested clinical or service action (e.g. "refer urgently to the breast clinic", "repeat the mammogram").';
