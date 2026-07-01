-- Flags that fire independently of the classification and completeness status,
-- each with a priority and a suggested action for the clinician or governance
-- team.

CREATE TABLE heart_failure_review_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    heart_failure_review_grade_id UUID NOT NULL
        REFERENCES heart_failure_review_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(35) NOT NULL DEFAULT ''
        CHECK (category IN (
            'urgent-review',
            'optimisation-gap',
            'deranged-u-e-hyperkalaemia',
            'fluid-overload',
            'missing-monitoring',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX heart_failure_review_grade_flag_grade_id_idx
    ON heart_failure_review_grade_flag (heart_failure_review_grade_id);

CREATE TRIGGER trigger_heart_failure_review_grade_flag_updated_at
    BEFORE UPDATE ON heart_failure_review_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE heart_failure_review_grade_flag IS
    'Flags that fire independently of the classification and completeness status, with priority and a suggested action for the clinician or governance team.';
COMMENT ON COLUMN heart_failure_review_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN heart_failure_review_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN heart_failure_review_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN heart_failure_review_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN heart_failure_review_grade_flag.heart_failure_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN heart_failure_review_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-URGENT-REVIEW-001).';
COMMENT ON COLUMN heart_failure_review_grade_flag.category IS
    'Flag category: urgent-review, optimisation-gap, deranged-u-e-hyperkalaemia, fluid-overload, missing-monitoring, incomplete, or other.';
COMMENT ON COLUMN heart_failure_review_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN heart_failure_review_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN heart_failure_review_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "arrange prompt clinical review", "review RAAS inhibitor and MRA dosing").';
