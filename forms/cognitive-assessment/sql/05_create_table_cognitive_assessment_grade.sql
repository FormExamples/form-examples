CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    mmse_total_score INTEGER NOT NULL DEFAULT 0
        CHECK (mmse_total_score >= 0 AND mmse_total_score <= 30),
    cognitive_category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (cognitive_category IN ('normal', 'mild_impairment', 'severe_impairment', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed MMSE grading result. Score 24-30 normal, 18-23 mild impairment, 0-17 severe impairment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.mmse_total_score IS
    'Total MMSE score, range 0 to 30.';
COMMENT ON COLUMN grade.cognitive_category IS
    'Classification: normal (24-30), mild_impairment (18-23), or severe_impairment (0-17).';
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
