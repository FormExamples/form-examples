-- Red-flag issues that fire independently of the total score, with
-- priority and a suggested action for the clinical team.

CREATE TABLE rockall_score_for_upper_gastrointestinal_bleeding_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    rockall_score_for_upper_gastrointestinal_bleeding_grade_id UUID NOT NULL
        REFERENCES rockall_score_for_upper_gastrointestinal_bleeding_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-mortality-risk',
            'shock',
            'high-risk-stigmata',
            'upper-gi-malignancy',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX rockall_score_for_upper_gastrointestinal_bleeding_grade_flag_grade_id_idx
    ON rockall_score_for_upper_gastrointestinal_bleeding_grade_flag (rockall_score_for_upper_gastrointestinal_bleeding_grade_id);

CREATE TRIGGER trigger_rockall_score_for_upper_gastrointestinal_bleeding_grade_flag_updated_at
    BEFORE UPDATE ON rockall_score_for_upper_gastrointestinal_bleeding_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE rockall_score_for_upper_gastrointestinal_bleeding_grade_flag IS
    'Red-flag issues that fire independently of the total score, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.rockall_score_for_upper_gastrointestinal_bleeding_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-MORTALITY-RISK-001).';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.category IS
    'Flag category: high-mortality-risk, shock, high-risk-stigmata, upper-gi-malignancy, incomplete, or other.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "admit, monitor, arrange endoscopic intervention").';
