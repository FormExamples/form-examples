CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    balance_score INTEGER NOT NULL DEFAULT 0
        CHECK (balance_score >= 0 AND balance_score <= 16),
    gait_score INTEGER NOT NULL DEFAULT 0
        CHECK (gait_score >= 0 AND gait_score <= 12),
    total_tinetti_score INTEGER NOT NULL DEFAULT 0
        CHECK (total_tinetti_score >= 0 AND total_tinetti_score <= 28),
    fall_risk_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (fall_risk_category IN ('high_fall_risk', 'moderate_risk', 'low_risk', '')),
    tug_time_seconds NUMERIC(5,1),
    tug_risk_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (tug_risk_category IN ('normal', 'moderate_risk', 'high_risk', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed Tinetti grading result for the mobility assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.balance_score IS
    'Tinetti Balance sub-score (0-16).';
COMMENT ON COLUMN grade.gait_score IS
    'Tinetti Gait sub-score (0-12).';
COMMENT ON COLUMN grade.total_tinetti_score IS
    'Total Tinetti score (balance + gait, 0-28). <19 = high risk, 19-24 = moderate, 25-28 = low.';
COMMENT ON COLUMN grade.fall_risk_category IS
    'Fall risk category: high_fall_risk (<19), moderate_risk (19-24), low_risk (25-28).';
COMMENT ON COLUMN grade.tug_time_seconds IS
    'Timed Up and Go test result in seconds.';
COMMENT ON COLUMN grade.tug_risk_category IS
    'TUG risk category: normal (<12s), moderate_risk (12-20s), high_risk (>20s).';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
