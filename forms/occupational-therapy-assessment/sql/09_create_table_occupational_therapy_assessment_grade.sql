CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    performance_mean_score NUMERIC(3,1)
        CHECK (performance_mean_score IS NULL OR (performance_mean_score >= 1.0 AND performance_mean_score <= 10.0)),
    satisfaction_mean_score NUMERIC(3,1)
        CHECK (satisfaction_mean_score IS NULL OR (satisfaction_mean_score >= 1.0 AND satisfaction_mean_score <= 10.0)),
    performance_category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (performance_category IN ('significant-issues', 'moderate-concerns', 'good-performance', '')),
    satisfaction_category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (satisfaction_category IN ('significant-issues', 'moderate-concerns', 'good-performance', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed COPM grading result for the occupational therapy assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.performance_mean_score IS
    'Mean COPM performance score across all rated occupational issues (1-10).';
COMMENT ON COLUMN grade.satisfaction_mean_score IS
    'Mean COPM satisfaction score across all rated occupational issues (1-10).';
COMMENT ON COLUMN grade.performance_category IS
    'Performance category: significant-issues (<5), moderate-concerns (5-7), good-performance (>7), or empty.';
COMMENT ON COLUMN grade.satisfaction_category IS
    'Satisfaction category: significant-issues (<5), moderate-concerns (5-7), good-performance (>7), or empty.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the COPM grading was computed.';

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
