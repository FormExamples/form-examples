-- Red-flag issues that fire independently of the total score, with
-- priority and a suggested action for the clinical team.

CREATE TABLE glasgow_blatchford_bleeding_score_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    glasgow_blatchford_bleeding_score_grade_id UUID NOT NULL
        REFERENCES glasgow_blatchford_bleeding_score_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-score-admit',
            'low-risk-discharge',
            'shock',
            'low-hb-transfusion',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('info', 'low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX glasgow_blatchford_bleeding_score_grade_flag_grade_id_idx
    ON glasgow_blatchford_bleeding_score_grade_flag (glasgow_blatchford_bleeding_score_grade_id);

CREATE TRIGGER trigger_glasgow_blatchford_bleeding_score_grade_flag_updated_at
    BEFORE UPDATE ON glasgow_blatchford_bleeding_score_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_blatchford_bleeding_score_grade_flag IS
    'Red-flag issues that fire independently of the total score, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.glasgow_blatchford_bleeding_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-SCORE-ADMIT-001).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.category IS
    'Flag category: high-score-admit, low-risk-discharge, shock, low-hb-transfusion, incomplete, or other.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.priority IS
    'Priority: info, low, medium, or high.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "admit and arrange urgent endoscopy").';
