-- Safety-critical flags that fire independently of the classification, with
-- a priority and a suggested action for the assessing clinician.

CREATE TABLE corrected_calcium_calculator_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    corrected_calcium_calculator_grade_id UUID NOT NULL
        REFERENCES corrected_calcium_calculator_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'severe-hypercalcaemia',
            'severe-hypocalcaemia',
            'symptomatic-hypercalcaemia',
            'hypercalcaemia',
            'hypocalcaemia',
            'incomplete-data',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX corrected_calcium_calculator_grade_flag_grade_id_idx
    ON corrected_calcium_calculator_grade_flag (corrected_calcium_calculator_grade_id);

CREATE TRIGGER trigger_corrected_calcium_calculator_grade_flag_updated_at
    BEFORE UPDATE ON corrected_calcium_calculator_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE corrected_calcium_calculator_grade_flag IS
    'Safety-critical flags that fire independently of the classification, with priority and a suggested action for the assessing clinician.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.corrected_calcium_calculator_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SEVERE-HYPERCALCAEMIA-001).';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.category IS
    'Flag category: severe-hypercalcaemia, severe-hypocalcaemia, symptomatic-hypercalcaemia, hypercalcaemia, hypocalcaemia, incomplete-data, or other.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN corrected_calcium_calculator_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "seek immediate senior or endocrine review").';
