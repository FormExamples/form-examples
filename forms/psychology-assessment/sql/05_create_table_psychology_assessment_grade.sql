CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    depression_score INTEGER
        CHECK (depression_score IS NULL OR (depression_score >= 0 AND depression_score <= 42)),
    depression_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (depression_severity IN ('normal', 'mild', 'moderate', 'severe', 'extremely_severe', '')),
    anxiety_score INTEGER
        CHECK (anxiety_score IS NULL OR (anxiety_score >= 0 AND anxiety_score <= 42)),
    anxiety_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (anxiety_severity IN ('normal', 'mild', 'moderate', 'severe', 'extremely_severe', '')),
    stress_score INTEGER
        CHECK (stress_score IS NULL OR (stress_score >= 0 AND stress_score <= 42)),
    stress_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (stress_severity IN ('normal', 'mild', 'moderate', 'severe', 'extremely_severe', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed DASS-21 grading result. Each subscale raw score (0-21) is doubled to align with DASS-42 norms, yielding a 0-42 range, and mapped to a severity category. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.depression_score IS
    'Depression subscale score, 0-42 (raw 0-21 doubled). NULL if incomplete.';
COMMENT ON COLUMN grade.depression_severity IS
    'Depression severity category: normal, mild, moderate, severe, or extremely_severe.';
COMMENT ON COLUMN grade.anxiety_score IS
    'Anxiety subscale score, 0-42 (raw 0-21 doubled). NULL if incomplete.';
COMMENT ON COLUMN grade.anxiety_severity IS
    'Anxiety severity category: normal, mild, moderate, severe, or extremely_severe.';
COMMENT ON COLUMN grade.stress_score IS
    'Stress subscale score, 0-42 (raw 0-21 doubled). NULL if incomplete.';
COMMENT ON COLUMN grade.stress_severity IS
    'Stress severity category: normal, mild, moderate, severe, or extremely_severe.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the DASS-21 grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
