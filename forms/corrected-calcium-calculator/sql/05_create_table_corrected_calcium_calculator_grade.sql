-- Computed corrected-calcium result. Stores the albumin-adjusted corrected
-- calcium value and its classification against the adult reference range
-- (hypocalcaemia / normal / hypercalcaemia / unknown), 1:1 with the parent
-- calculation record.

CREATE TABLE corrected_calcium_calculator_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    corrected_calcium_calculator_id UUID NOT NULL UNIQUE
        REFERENCES corrected_calcium_calculator(id) ON DELETE CASCADE,

    corrected_calcium_mmol_l NUMERIC(4,2),
    classification VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (classification IN ('hypocalcaemia', 'normal', 'hypercalcaemia', 'unknown', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_corrected_calcium_calculator_grade_updated_at
    BEFORE UPDATE ON corrected_calcium_calculator_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE corrected_calcium_calculator_grade IS
    'Computed corrected-calcium result: the albumin-adjusted corrected calcium value and its classification against the adult reference range (1:1 with the parent calculation record).';
COMMENT ON COLUMN corrected_calcium_calculator_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN corrected_calcium_calculator_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN corrected_calcium_calculator_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN corrected_calcium_calculator_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN corrected_calcium_calculator_grade.corrected_calcium_calculator_id IS
    'Foreign key to the parent calculation record (unique, 1:1).';
COMMENT ON COLUMN corrected_calcium_calculator_grade.corrected_calcium_mmol_l IS
    'Albumin-adjusted corrected calcium in mmol/L (null when either input is missing).';
COMMENT ON COLUMN corrected_calcium_calculator_grade.classification IS
    'Classification against the adult reference range 2.20-2.60 mmol/L: hypocalcaemia, normal, hypercalcaemia, or unknown.';
COMMENT ON COLUMN corrected_calcium_calculator_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
