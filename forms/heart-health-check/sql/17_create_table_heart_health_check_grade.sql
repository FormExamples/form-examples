CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    risk_category VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (risk_category IN ('draft', 'low', 'moderate', 'high')),
    ten_year_risk_percent NUMERIC(5, 1) NOT NULL DEFAULT 0
        CHECK (ten_year_risk_percent >= 0 AND ten_year_risk_percent <= 100),
    heart_age SMALLINT
        CHECK (heart_age IS NULL OR (heart_age >= 0 AND heart_age <= 150)),
    graded_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Grading result summarizing 10-year CVD risk and heart age. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.risk_category IS
    'Risk classification: draft, low, moderate, or high.';
COMMENT ON COLUMN grade.ten_year_risk_percent IS
    'Estimated 10-year cardiovascular disease risk percentage.';
COMMENT ON COLUMN grade.heart_age IS
    'Estimated heart age in years.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the grading was last performed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
