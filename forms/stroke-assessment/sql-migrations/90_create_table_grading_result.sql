CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    nihss_total_score INTEGER
        CHECK (nihss_total_score IS NULL OR (nihss_total_score >= 0 AND nihss_total_score <= 42)),
    stroke_severity VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (stroke_severity IN ('no_stroke_symptoms', 'minor', 'moderate', 'moderate_to_severe', 'severe', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed NIHSS stroke severity grading result. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.nihss_total_score IS
    'NIHSS total score (0-42); 0=no symptoms, 1-4=minor, 5-15=moderate, 16-20=moderate to severe, 21-42=severe.';
COMMENT ON COLUMN grade.stroke_severity IS
    'Stroke severity category: no_stroke_symptoms, minor, moderate, moderate_to_severe, severe, or empty string.';
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
