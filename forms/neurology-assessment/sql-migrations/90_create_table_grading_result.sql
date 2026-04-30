CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    nihss_total_score INTEGER NOT NULL DEFAULT 0
        CHECK (nihss_total_score >= 0 AND nihss_total_score <= 42),
    nihss_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (nihss_severity IN ('no_stroke_symptoms', 'minor', 'moderate', 'moderate_to_severe', 'severe', '')),
    modified_rankin_score INTEGER
        CHECK (modified_rankin_score IS NULL OR (modified_rankin_score >= 0 AND modified_rankin_score <= 6)),
    barthel_index INTEGER
        CHECK (barthel_index IS NULL OR (barthel_index >= 0 AND barthel_index <= 100)),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed NIHSS grading result for the neurology assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.nihss_total_score IS
    'NIHSS total score (0-42).';
COMMENT ON COLUMN grade.nihss_severity IS
    'NIHSS severity: no_stroke_symptoms (0), minor (1-4), moderate (5-15), moderate_to_severe (16-20), severe (21-42).';
COMMENT ON COLUMN grade.modified_rankin_score IS
    'Modified Rankin Scale score (0-6) at time of grading.';
COMMENT ON COLUMN grade.barthel_index IS
    'Barthel Index (0-100) at time of grading.';
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
