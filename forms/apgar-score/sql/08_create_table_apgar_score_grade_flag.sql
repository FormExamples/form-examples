-- Red-flag issues that fire independently of the totals, with priority and a
-- suggested action for the clinical team. Categories mirror spec section 5:
-- resuscitation required (any total <= 3), continue scoring (5-minute total
-- below 7), falling trend, support and stimulation (any total 4-6), missing
-- 10-minute score, and incomplete assessment (a sign missing at a scored
-- timepoint).

CREATE TABLE apgar_score_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    apgar_score_grade_id UUID NOT NULL
        REFERENCES apgar_score_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'resuscitation-needed',
            'continue-scoring',
            'falling-trend',
            'support-and-stimulation',
            'missing-ten-minute-score',
            'incomplete-assessment',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX apgar_score_grade_flag_grade_id_idx
    ON apgar_score_grade_flag (apgar_score_grade_id);

CREATE TRIGGER trigger_apgar_score_grade_flag_updated_at
    BEFORE UPDATE ON apgar_score_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE apgar_score_grade_flag IS
    'Red-flag issues that fire independently of the totals, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN apgar_score_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN apgar_score_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN apgar_score_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN apgar_score_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN apgar_score_grade_flag.apgar_score_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN apgar_score_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-RESUSCITATION-NEEDED-001).';
COMMENT ON COLUMN apgar_score_grade_flag.category IS
    'Flag category (see CHECK constraint for enumeration): resuscitation-needed, continue-scoring, falling-trend, support-and-stimulation, missing-ten-minute-score, incomplete-assessment, or other.';
COMMENT ON COLUMN apgar_score_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN apgar_score_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN apgar_score_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "commence active resuscitation and obtain neonatal support").';
