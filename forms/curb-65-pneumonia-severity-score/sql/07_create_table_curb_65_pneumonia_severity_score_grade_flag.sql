-- Advisory safety flags that fire independently of the numeric band,
-- with priority and a suggested action for the clinical team.

CREATE TABLE curb_65_pneumonia_severity_score_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    curb_65_pneumonia_severity_score_grade_id UUID NOT NULL
        REFERENCES curb_65_pneumonia_severity_score_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-severity-admit',
            'consider-icu',
            'hypotension',
            'new-confusion',
            'hypoxia',
            'incomplete-criterion',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX curb_65_pneumonia_severity_score_grade_flag_grade_id_idx
    ON curb_65_pneumonia_severity_score_grade_flag (curb_65_pneumonia_severity_score_grade_id);

CREATE TRIGGER trigger_curb_65_pneumonia_severity_score_grade_flag_updated_at
    BEFORE UPDATE ON curb_65_pneumonia_severity_score_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE curb_65_pneumonia_severity_score_grade_flag IS
    'Advisory safety flags that fire independently of the numeric band, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.curb_65_pneumonia_severity_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-SEVERITY-ADMIT-001).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.category IS
    'Flag category: high-severity-admit, consider-icu, hypotension, new-confusion, hypoxia, incomplete-criterion, or other.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "hospitalise and manage as severe CAP", "assess for intensive-care / HDU admission").';
