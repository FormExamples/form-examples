CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,

    completeness_level VARCHAR(12) NOT NULL DEFAULT 'incomplete'
        CHECK (completeness_level IN ('complete', 'partial', 'incomplete')),
    sections_completed INTEGER NOT NULL DEFAULT 0
        CHECK (sections_completed >= 0),
    total_sections INTEGER NOT NULL DEFAULT 9
        CHECK (total_sections >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed completeness grading result for the advance statement about care. One-to-one child of assessment.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.completeness_level IS
    'Overall completeness classification: complete, partial, or incomplete.';
COMMENT ON COLUMN grade.sections_completed IS
    'Number of sections that have been adequately completed.';
COMMENT ON COLUMN grade.total_sections IS
    'Total number of sections in the advance statement.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the completeness grading was computed.';

