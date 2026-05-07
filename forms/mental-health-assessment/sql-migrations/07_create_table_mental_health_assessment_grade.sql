CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    phq9_total_score INTEGER NOT NULL DEFAULT 0
        CHECK (phq9_total_score >= 0 AND phq9_total_score <= 27),
    phq9_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (phq9_severity IN ('minimal', 'mild', 'moderate', 'moderately_severe', 'severe', '')),
    gad7_total_score INTEGER NOT NULL DEFAULT 0
        CHECK (gad7_total_score >= 0 AND gad7_total_score <= 21),
    gad7_severity VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (gad7_severity IN ('minimal', 'mild', 'moderate', 'severe', '')),
    risk_level VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_level IN ('low', 'moderate', 'high', 'imminent', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed PHQ-9 and GAD-7 grading result for the mental health assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.phq9_total_score IS
    'PHQ-9 total score (0-27).';
COMMENT ON COLUMN grade.phq9_severity IS
    'PHQ-9 severity: minimal (0-4), mild (5-9), moderate (10-14), moderately_severe (15-19), severe (20-27).';
COMMENT ON COLUMN grade.gad7_total_score IS
    'GAD-7 total score (0-21).';
COMMENT ON COLUMN grade.gad7_severity IS
    'GAD-7 severity: minimal (0-4), mild (5-9), moderate (10-14), severe (15-21).';
COMMENT ON COLUMN grade.risk_level IS
    'Overall risk level from risk assessment: low, moderate, high, imminent, or empty string.';
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
