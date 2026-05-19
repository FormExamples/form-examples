-- Per-grade record of additional flags raised during eligibility evaluation
-- (educational, advisory, or workflow-routing hints distinct from rules that
-- directly determine the outcome).

CREATE TABLE grade_additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    grade_id UUID NOT NULL
        REFERENCES grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(64) NOT NULL DEFAULT '',
    category VARCHAR(32) NOT NULL DEFAULT '' CHECK (category IN (
        'completeness',
        'data-quality',
        'workflow',
        'education',
        'safeguarding',
        'pregnancy',
        'age-exemption',
        ''
    )),
    description TEXT NOT NULL DEFAULT '',
    priority VARCHAR(16) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', ''))
);

CREATE TRIGGER trigger_grade_additional_flag_updated_at
    BEFORE UPDATE ON grade_additional_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade_additional_flag IS
    'Per-grade advisory flags surfaced to the practitioner.';
COMMENT ON COLUMN grade_additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade_additional_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN grade_additional_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN grade_additional_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN grade_additional_flag.grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN grade_additional_flag.flag_id IS
    'Stable identifier of the flag.';
COMMENT ON COLUMN grade_additional_flag.category IS
    'Flag category for grouping in the UI.';
COMMENT ON COLUMN grade_additional_flag.description IS
    'Human-readable description shown to the practitioner.';
COMMENT ON COLUMN grade_additional_flag.priority IS
    'Display priority: low, medium, or high.';
