-- Computed Caprini grading result. Stores the summed total score, the
-- derived risk band (very-low / low / moderate / high), and the
-- recommended prophylaxis strategy (downgraded to mechanical when the
-- bleeding risk is high). The fired rules and flags live in dedicated
-- child tables.

CREATE TABLE caprini_venous_thromboembolism_risk_assessment_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    caprini_venous_thromboembolism_risk_assessment_id UUID NOT NULL UNIQUE
        REFERENCES caprini_venous_thromboembolism_risk_assessment(id) ON DELETE CASCADE,

    total_score INT,
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('very-low', 'low', 'moderate', 'high', '')),
    prophylaxis_recommendation TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_caprini_venous_thromboembolism_risk_assessment_grade_updated_at
    BEFORE UPDATE ON caprini_venous_thromboembolism_risk_assessment_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE caprini_venous_thromboembolism_risk_assessment_grade IS
    'Computed Caprini grading result: summed total score, derived risk band (very-low / low / moderate / high), and the recommended prophylaxis strategy.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.caprini_venous_thromboembolism_risk_assessment_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.total_score IS
    'Summed Caprini score: age-band weight plus the fixed weight of every fired factor (0..40+).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.risk_band IS
    'Derived risk band: very-low (0-1), low (2), moderate (3-4), or high (>= 5).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.prophylaxis_recommendation IS
    'Recommended prophylaxis strategy: early-ambulation, mechanical, pharmacological-or-mechanical, or pharmacological-plus-mechanical (downgraded to mechanical when the bleeding risk is high).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
