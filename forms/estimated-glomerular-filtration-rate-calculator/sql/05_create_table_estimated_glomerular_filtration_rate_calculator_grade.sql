-- Computed eGFR result. Stores the derived serum creatinine in mg/dL, the
-- eGFR in mL/min/1.73 m^2, and its CKD G-stage classification (G1-G5) with a
-- human-readable label, 1:1 with the parent calculation record.

CREATE TABLE estimated_glomerular_filtration_rate_calculator_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    estimated_glomerular_filtration_rate_calculator_id UUID NOT NULL UNIQUE
        REFERENCES estimated_glomerular_filtration_rate_calculator(id) ON DELETE CASCADE,

    serum_creatinine_mg_dl NUMERIC(6,3),
    egfr_ml_min_1_73m2 NUMERIC(6,1),
    g_stage VARCHAR(3) NOT NULL DEFAULT ''
        CHECK (g_stage IN ('G1', 'G2', 'G3a', 'G3b', 'G4', 'G5', '')),
    g_stage_label VARCHAR(60) NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_estimated_glomerular_filtration_rate_calculator_grade_updated_at
    BEFORE UPDATE ON estimated_glomerular_filtration_rate_calculator_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE estimated_glomerular_filtration_rate_calculator_grade IS
    'Computed eGFR result: the derived serum creatinine in mg/dL, the eGFR in mL/min/1.73 m^2, and its CKD G-stage classification (1:1 with the parent calculation record).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.estimated_glomerular_filtration_rate_calculator_id IS
    'Foreign key to the parent calculation record (unique, 1:1).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.serum_creatinine_mg_dl IS
    'Serum creatinine converted to mg/dL (serum_creatinine_umol_l / 88.42); null when the input is missing.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.egfr_ml_min_1_73m2 IS
    'Estimated glomerular filtration rate in mL/min/1.73 m^2 (null when any required input is missing).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.g_stage IS
    'CKD G-stage banded from the unrounded eGFR: G1 (>=90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), or G5 (<15).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.g_stage_label IS
    'Human-readable G-stage label (e.g. "Mildly decreased").';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
