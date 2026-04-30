CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    total_fms_score INTEGER NOT NULL DEFAULT 0
        CHECK (total_fms_score >= 0 AND total_fms_score <= 21),
    risk_category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (risk_category IN ('increased_injury_risk', 'moderate_risk', 'low_risk', '')),
    asymmetry_count INTEGER NOT NULL DEFAULT 0
        CHECK (asymmetry_count >= 0),
    pain_count INTEGER NOT NULL DEFAULT 0
        CHECK (pain_count >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed FMS grading result for the kinesiology assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.total_fms_score IS
    'Total Functional Movement Screen score (0-21, sum of 7 movement test final scores).';
COMMENT ON COLUMN grade.risk_category IS
    'Injury risk category: increased_injury_risk (0-14), moderate_risk (15-17), low_risk (18-21).';
COMMENT ON COLUMN grade.asymmetry_count IS
    'Number of bilateral tests showing left-right score asymmetry.';
COMMENT ON COLUMN grade.pain_count IS
    'Number of movement tests where pain was noted or clearing tests were positive.';
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
