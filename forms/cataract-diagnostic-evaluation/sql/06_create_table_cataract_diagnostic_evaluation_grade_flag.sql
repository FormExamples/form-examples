-- Safety-critical flags that fire independently of the surgical-candidacy
-- recommendation, with a priority and a suggested action. Flags are never
-- suppressed by a clinician override.

CREATE TABLE cataract_diagnostic_evaluation_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    cataract_diagnostic_evaluation_grade_id UUID NOT NULL
        REFERENCES cataract_diagnostic_evaluation_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'competing-pathology-suspected',
            'raised-iop',
            'view-obscured-fundus-not-assessed',
            'rapid-progression',
            'biometry-incomplete-for-surgical-planning',
            'paediatric',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX cataract_diagnostic_evaluation_grade_flag_grade_id_index
    ON cataract_diagnostic_evaluation_grade_flag (cataract_diagnostic_evaluation_grade_id);

CREATE TRIGGER trigger_cataract_diagnostic_evaluation_grade_flag_updated_at
    BEFORE UPDATE ON cataract_diagnostic_evaluation_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cataract_diagnostic_evaluation_grade_flag IS
    'Safety-critical flags that fire independently of the surgical-candidacy recommendation, with a priority and a suggested action. Flags are never suppressed by a clinician override.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.cataract_diagnostic_evaluation_grade_id IS
    'Foreign key to the parent cataract_diagnostic_evaluation_grade table.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.flag_id IS
    'Stable flag identifier, such as F-RAISED-IOP-001.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.category IS
    'Flag category, such as raised-iop or competing-pathology-suspected.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation_grade_flag.suggested_action IS
    'Suggested clinical action, such as "refer to glaucoma service before cataract listing".';
