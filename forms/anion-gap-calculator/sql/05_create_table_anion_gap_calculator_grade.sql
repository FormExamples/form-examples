-- Computed anion-gap result. Stores the raw anion gap, the albumin-corrected
-- anion gap, and the classification band (low / normal / high / very-high),
-- 1:1 with the parent calculation record.

CREATE TABLE anion_gap_calculator_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anion_gap_calculator_id UUID NOT NULL UNIQUE
        REFERENCES anion_gap_calculator(id) ON DELETE CASCADE,

    anion_gap NUMERIC(6,2),
    corrected_anion_gap NUMERIC(6,2),
    classification VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (classification IN ('normal', 'high', 'very-high', 'low', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_anion_gap_calculator_grade_updated_at
    BEFORE UPDATE ON anion_gap_calculator_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anion_gap_calculator_grade IS
    'Computed anion-gap result: the raw anion gap, the albumin-corrected anion gap, and the classification band (low / normal / high / very-high), 1:1 with the parent calculation record.';
COMMENT ON COLUMN anion_gap_calculator_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anion_gap_calculator_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anion_gap_calculator_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anion_gap_calculator_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anion_gap_calculator_grade.anion_gap_calculator_id IS
    'Foreign key to the parent calculation record (unique, 1:1).';
COMMENT ON COLUMN anion_gap_calculator_grade.anion_gap IS
    'Raw anion gap in mmol/L (null when any required electrolyte is missing).';
COMMENT ON COLUMN anion_gap_calculator_grade.corrected_anion_gap IS
    'Albumin-corrected anion gap in mmol/L (null when albumin is missing).';
COMMENT ON COLUMN anion_gap_calculator_grade.classification IS
    'Classification band using the corrected gap when available, else the raw gap: low, normal, high, or very-high.';
COMMENT ON COLUMN anion_gap_calculator_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
