-- Safety-critical flags that fire independently of the classification, with
-- a priority and a suggested action for the assessing clinician.

CREATE TABLE anion_gap_calculator_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anion_gap_calculator_grade_id UUID NOT NULL
        REFERENCES anion_gap_calculator_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'very-high',
            'high-hagma',
            'hypoalbuminaemia-masking',
            'low',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', 'urgent', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX anion_gap_calculator_grade_flag_grade_id_idx
    ON anion_gap_calculator_grade_flag (anion_gap_calculator_grade_id);

CREATE TRIGGER trigger_anion_gap_calculator_grade_flag_updated_at
    BEFORE UPDATE ON anion_gap_calculator_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anion_gap_calculator_grade_flag IS
    'Safety-critical flags that fire independently of the classification, with priority and a suggested action for the assessing clinician.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.anion_gap_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-VERY-HIGH-001).';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.category IS
    'Flag category: very-high, high-hagma, hypoalbuminaemia-masking, low, incomplete, or other.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.priority IS
    'Priority: low, medium, high, or urgent.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN anion_gap_calculator_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "urgent search for the cause of the metabolic acidosis").';
