CREATE TABLE systematic_coronary_risk_evaluation_2_diabetes.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES systematic_coronary_risk_evaluation_2_diabetes.assessment(id) ON DELETE CASCADE,
    risk_category VARCHAR(20) NOT NULL DEFAULT 'low'
        CHECK (risk_category IN ('low', 'moderate', 'high', 'veryHigh')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON systematic_coronary_risk_evaluation_2_diabetes.grade
    FOR EACH ROW
    EXECUTE FUNCTION systematic_coronary_risk_evaluation_2_diabetes.set_updated_at();

COMMENT ON TABLE systematic_coronary_risk_evaluation_2_diabetes.grade IS
    'Computed SCORE2-Diabetes risk grading result. One-to-one child of assessment.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.risk_category IS
    'Overall risk classification: low, moderate, high, or veryHigh.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grade.deleted_at IS
    'Timestamp when this row was deleted.';
