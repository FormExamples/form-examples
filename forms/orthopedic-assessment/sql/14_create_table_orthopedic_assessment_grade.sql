CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    dash_score NUMERIC(5,1) NOT NULL DEFAULT 0
        CHECK (dash_score >= 0 AND dash_score <= 100),
    disability_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (disability_category IN ('none', 'mild', 'moderate', 'severe', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed DASH grading result for the orthopedic assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.dash_score IS
    'DASH score: 0 = no disability, 100 = most severe disability.';
COMMENT ON COLUMN grade.disability_category IS
    'Disability category: none (0), mild (1-33), moderate (34-66), severe (67-100), or empty.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the DASH grading was computed.';

COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
