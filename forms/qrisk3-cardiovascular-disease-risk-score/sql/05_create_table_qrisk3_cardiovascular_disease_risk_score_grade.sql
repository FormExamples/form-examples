-- Computed QRISK3 grading result. Stores the linear predictor from the
-- Cox proportional-hazards model, the 10-year CVD risk percentage, the
-- derived risk band, and the estimated heart age.

CREATE TABLE qrisk3_cardiovascular_disease_risk_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    qrisk3_cardiovascular_disease_risk_score_id UUID NOT NULL UNIQUE
        REFERENCES qrisk3_cardiovascular_disease_risk_score(id) ON DELETE CASCADE,

    ten_year_risk_percent NUMERIC(4,1),
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'raised', 'high', '')),
    heart_age NUMERIC(4,1),
    linear_predictor NUMERIC(12,6),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_qrisk3_cardiovascular_disease_risk_score_grade_updated_at
    BEFORE UPDATE ON qrisk3_cardiovascular_disease_risk_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE qrisk3_cardiovascular_disease_risk_score_grade IS
    'Computed QRISK3 grading result: the linear predictor, the 10-year CVD risk percentage, the derived risk band, and the estimated heart age.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.qrisk3_cardiovascular_disease_risk_score_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.ten_year_risk_percent IS
    'Ten-year cardiovascular disease risk percentage (0.0-99.9, one decimal place).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.risk_band IS
    'Derived risk band: low (< 10%), raised (>= 10%), or high (>= 20%).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.heart_age IS
    'Estimated heart age in years for the same risk with modifiable factors optimal (null when not computable).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.linear_predictor IS
    'Linear predictor from the sex-specific Cox proportional-hazards model.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
