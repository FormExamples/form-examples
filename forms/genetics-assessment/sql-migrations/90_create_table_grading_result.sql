CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    result_category VARCHAR(100) NOT NULL DEFAULT '',
    result_score NUMERIC,
    result_notes TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS 'Computed grading / scoring result. One-to-one child of assessment. The result_category column holds a form-specific label (e.g. Low, Moderate, High, or Complete/Incomplete); result_score is optional for numeric instruments.';
COMMENT ON COLUMN grade.assessment_id IS 'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.result_category IS 'Form-specific outcome label.';
COMMENT ON COLUMN grade.result_score IS 'Optional numeric score for quantitative instruments.';
COMMENT ON COLUMN grade.result_notes IS 'Free-text clinician notes accompanying the result.';
COMMENT ON COLUMN grade.graded_at IS 'Timestamp when the grading was computed.';

COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
