-- Safety-critical flags that fire independently of the aggregate risk
-- band, with priority and a suggested action for the ward and
-- escalation team.

CREATE TABLE modified_early_warning_score_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    modified_early_warning_score_grade_id UUID NOT NULL
        REFERENCES modified_early_warning_score_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'aggregate-escalation',
            'single-parameter-3',
            'deteriorating-trend',
            'hypotension',
            'reduced-consciousness',
            'tachypnoea-bradypnoea',
            'tachycardia-bradycardia',
            'pyrexia-hypothermia',
            'incomplete-observation',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX modified_early_warning_score_grade_flag_grade_id_idx
    ON modified_early_warning_score_grade_flag (modified_early_warning_score_grade_id);

CREATE TRIGGER trigger_modified_early_warning_score_grade_flag_updated_at
    BEFORE UPDATE ON modified_early_warning_score_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE modified_early_warning_score_grade_flag IS
    'Safety-critical flags that fire independently of the aggregate risk band, with priority and a suggested action for the ward and escalation team.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.modified_early_warning_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SINGLE-PARAMETER-3-001).';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.category IS
    'Flag category: aggregate-escalation, single-parameter-3, deteriorating-trend, hypotension, reduced-consciousness, tachypnoea-bradypnoea, tachycardia-bradycardia, pyrexia-hypothermia, incomplete-observation, or other.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN modified_early_warning_score_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "urgent medical review", "consider critical-care outreach").';
