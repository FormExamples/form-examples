CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    vaccination_level VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (vaccination_level IN ('upToDate', 'partiallyComplete', 'overdue', 'contraindicated', 'draft', '')),
    vaccination_score SMALLINT NOT NULL DEFAULT 0
        CHECK (vaccination_score >= 0 AND vaccination_score <= 100),
    graded_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Grading result summarizing vaccination level and composite score. One-to-one child of assessment.';
COMMENT ON COLUMN grade.vaccination_level IS
    'Vaccination compliance level: upToDate, partiallyComplete, overdue, contraindicated, or draft.';
COMMENT ON COLUMN grade.vaccination_score IS
    'Composite vaccination score (0-100).';

COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN grade.graded_at IS
    'Graded at.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when this row was deleted.';
