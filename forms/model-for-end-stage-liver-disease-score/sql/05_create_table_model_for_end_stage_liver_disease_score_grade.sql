-- Computed MELD grading result. Stores the derived intermediate values
-- (unit-converted and dialysis-adjusted creatinine), the integer MELD
-- score (6-40 when computable), the mapped 3-month mortality band, and
-- the estimated mortality percentage.

CREATE TABLE model_for_end_stage_liver_disease_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    model_for_end_stage_liver_disease_score_id UUID NOT NULL UNIQUE
        REFERENCES model_for_end_stage_liver_disease_score(id) ON DELETE CASCADE,

    bilirubin_mg_dl NUMERIC(7,2),
    creatinine_mg_dl NUMERIC(7,2),
    creatinine_adjusted NUMERIC(7,2),
    dialysis_rule_applied BOOLEAN NOT NULL DEFAULT FALSE,

    meld_score INT
        CHECK (meld_score IS NULL OR (meld_score BETWEEN 6 AND 40)),
    mortality_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (mortality_band IN ('low', 'moderate', 'high', 'very-high', 'extreme', '')),
    estimated_mortality_percent NUMERIC(5,2),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_model_for_end_stage_liver_disease_score_grade_updated_at
    BEFORE UPDATE ON model_for_end_stage_liver_disease_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE model_for_end_stage_liver_disease_score_grade IS
    'Computed MELD grading result: derived intermediate values, the integer MELD score (6-40 when computable), the mapped 3-month mortality band, and the estimated mortality percentage.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.model_for_end_stage_liver_disease_score_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.bilirubin_mg_dl IS
    'Total bilirubin converted to mg/dL (from umol/L when required).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.creatinine_mg_dl IS
    'Serum creatinine converted to mg/dL (from umol/L when required), before the dialysis rule and bounds.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.creatinine_adjusted IS
    'Creatinine after the dialysis rule (set to 4.0 mg/dL when the rule applied), before the 1.0-4.0 bounds.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.dialysis_rule_applied IS
    'True when the dialysis creatinine rule applied (>= 2 haemodialysis sessions in the past 7 days or >= 24 h CVVHD).';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.meld_score IS
    'Integer MELD score clamped to 6-40; NULL when a required lab input for the chosen variant is missing.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.mortality_band IS
    'Mapped estimated 3-month mortality band: low, moderate, high, very-high, or extreme.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.estimated_mortality_percent IS
    'Estimated 3-month mortality as a percentage for the mapped band.';
COMMENT ON COLUMN model_for_end_stage_liver_disease_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
