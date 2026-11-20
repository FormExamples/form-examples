CREATE TABLE advance_statement_about_care.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES advance_statement_about_care.assessment(id) ON DELETE CASCADE,

    completeness_level VARCHAR(12) NOT NULL DEFAULT 'incomplete'
        CHECK (completeness_level IN ('complete', 'partial', 'incomplete')),
    sections_completed INTEGER NOT NULL DEFAULT 0
        CHECK (sections_completed >= 0),
    total_sections INTEGER NOT NULL DEFAULT 9
        CHECK (total_sections >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON advance_statement_about_care.grade
    FOR EACH ROW
    EXECUTE FUNCTION advance_statement_about_care.set_updated_at();

COMMENT ON TABLE advance_statement_about_care.grade IS
    'Computed completeness grading result for the advance statement about care. One-to-one child of assessment.';
COMMENT ON COLUMN advance_statement_about_care.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN advance_statement_about_care.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN advance_statement_about_care.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN advance_statement_about_care.grade.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN advance_statement_about_care.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN advance_statement_about_care.grade.completeness_level IS
    'Overall completeness classification: complete, partial, or incomplete.';
COMMENT ON COLUMN advance_statement_about_care.grade.sections_completed IS
    'Number of sections that have been adequately completed.';
COMMENT ON COLUMN advance_statement_about_care.grade.total_sections IS
    'Total number of sections in the advance statement.';
COMMENT ON COLUMN advance_statement_about_care.grade.graded_at IS
    'Timestamp when the completeness grading was computed.';

