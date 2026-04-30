CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    risk_level VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (risk_level IN ('low', 'moderate', 'high')),
    total_risk_score INTEGER NOT NULL DEFAULT 0
        CHECK (total_risk_score >= 0),
    cancer_genetics_score INTEGER NOT NULL DEFAULT 0
        CHECK (cancer_genetics_score >= 0),
    cardiovascular_genetics_score INTEGER NOT NULL DEFAULT 0
        CHECK (cardiovascular_genetics_score >= 0),
    neurogenetics_score INTEGER NOT NULL DEFAULT 0
        CHECK (neurogenetics_score >= 0),
    reproductive_genetics_score INTEGER NOT NULL DEFAULT 0
        CHECK (reproductive_genetics_score >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed genetic risk stratification result. 0-2 = Low, 3-5 = Moderate, 6+ = High. One-to-one child of assessment.';
COMMENT ON COLUMN grade.risk_level IS
    'Overall risk classification: low, moderate, or high.';
COMMENT ON COLUMN grade.total_risk_score IS
    'Total weighted risk score across all genetics domains (0-6+).';
COMMENT ON COLUMN grade.cancer_genetics_score IS
    'Risk sub-score for cancer genetics domain.';
COMMENT ON COLUMN grade.cardiovascular_genetics_score IS
    'Risk sub-score for cardiovascular genetics domain.';
COMMENT ON COLUMN grade.neurogenetics_score IS
    'Risk sub-score for neurogenetics domain.';
COMMENT ON COLUMN grade.reproductive_genetics_score IS
    'Risk sub-score for reproductive genetics domain.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the grading was computed.';

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
