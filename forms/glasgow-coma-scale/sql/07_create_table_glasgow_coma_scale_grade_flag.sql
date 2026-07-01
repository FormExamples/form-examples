-- Red-flag issues that fire independently of the severity band, with
-- priority and a suggested action for the clinical team.

CREATE TABLE glasgow_coma_scale_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    glasgow_coma_scale_grade_id UUID NOT NULL
        REFERENCES glasgow_coma_scale_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'airway-risk',
            'deteriorating',
            'unequal-pupils',
            'untestable-component',
            'falling-motor',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX glasgow_coma_scale_grade_flag_grade_id_idx
    ON glasgow_coma_scale_grade_flag (glasgow_coma_scale_grade_id);

CREATE TRIGGER trigger_glasgow_coma_scale_grade_flag_updated_at
    BEFORE UPDATE ON glasgow_coma_scale_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_coma_scale_grade_flag IS
    'Red-flag issues that fire independently of the severity band, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.glasgow_coma_scale_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-AIRWAY-RISK-001, F-UNEQUAL-PUPILS-001).';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.category IS
    'Flag category: airway-risk (GCS <= 8 / coma), deteriorating, unequal-pupils, untestable-component, falling-motor, or other.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN glasgow_coma_scale_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "consider definitive airway management and senior escalation", "urgent CT head and neurosurgical referral").';
