-- Flagged issues raised independently of the progress classification, scanned
-- across the whole observation series, each with a priority and a suggested
-- action for the labour-ward team.

CREATE TABLE partogram_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    partogram_grade_id UUID NOT NULL
        REFERENCES partogram_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'action-line-crossed',
            'alert-line-crossed',
            'fetal-heart-abnormal',
            'meconium',
            'maternal-obs-abnormal',
            'poor-progress',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX partogram_grade_flag_grade_id_idx
    ON partogram_grade_flag (partogram_grade_id);

CREATE TRIGGER trigger_partogram_grade_flag_updated_at
    BEFORE UPDATE ON partogram_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE partogram_grade_flag IS
    'Flagged issues raised independently of the progress classification, scanned across the whole observation series, with priority and a suggested action for the labour-ward team.';
COMMENT ON COLUMN partogram_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN partogram_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN partogram_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN partogram_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN partogram_grade_flag.partogram_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN partogram_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-FETAL-HEART-ABNORMAL-001).';
COMMENT ON COLUMN partogram_grade_flag.category IS
    'Flag category: action-line-crossed, alert-line-crossed, fetal-heart-abnormal, meconium, maternal-obs-abnormal, poor-progress, incomplete, or other.';
COMMENT ON COLUMN partogram_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN partogram_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN partogram_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "escalate to the obstetric registrar for review").';
