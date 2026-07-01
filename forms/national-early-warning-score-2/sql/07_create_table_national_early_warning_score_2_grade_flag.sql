-- Safety-critical flags that fire independently of the aggregate risk
-- band, with priority and a suggested action for the ward and
-- escalation team.

CREATE TABLE national_early_warning_score_2_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    national_early_warning_score_2_grade_id UUID NOT NULL
        REFERENCES national_early_warning_score_2_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-score-escalate',
            'single-parameter-3',
            'deteriorating-trend',
            'out-of-scope-population',
            'incomplete-observation',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX national_early_warning_score_2_grade_flag_grade_id_idx
    ON national_early_warning_score_2_grade_flag (national_early_warning_score_2_grade_id);

CREATE TRIGGER trigger_national_early_warning_score_2_grade_flag_updated_at
    BEFORE UPDATE ON national_early_warning_score_2_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE national_early_warning_score_2_grade_flag IS
    'Safety-critical flags that fire independently of the aggregate risk band, with priority and a suggested action for the ward and escalation team.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.national_early_warning_score_2_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SINGLE-PARAMETER-3-001).';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.category IS
    'Flag category: high-score-escalate, single-parameter-3, deteriorating-trend, out-of-scope-population, incomplete-observation, or other.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN national_early_warning_score_2_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "escalate to the acute-illness team", "review SpO2 target against Scale 2").';
