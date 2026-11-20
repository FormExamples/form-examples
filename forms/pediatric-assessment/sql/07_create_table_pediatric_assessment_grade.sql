CREATE TABLE pediatric_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES pediatric_assessment.assessment(id) ON DELETE CASCADE,
    overall_outcome VARCHAR(10) NOT NULL DEFAULT 'pass'
        CHECK (overall_outcome IN ('pass', 'concern', 'refer')),
    developmental_score INTEGER
        CHECK (developmental_score IS NULL OR developmental_score >= 0),
    growth_classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (growth_classification IN ('normal', 'underweight', 'overweight', 'failure-to-thrive', '')),
    environmental_risk_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (environmental_risk_level IN ('low', 'moderate', 'high', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON pediatric_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION pediatric_assessment.set_updated_at();

COMMENT ON TABLE pediatric_assessment.grade IS
    'Computed developmental screening result. Outcome based on milestone achievement, growth parameters, and environmental risk factors. One-to-one child of assessment.';
COMMENT ON COLUMN pediatric_assessment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN pediatric_assessment.grade.overall_outcome IS
    'Overall developmental screening outcome: pass, concern, or refer.';
COMMENT ON COLUMN pediatric_assessment.grade.developmental_score IS
    'Aggregate developmental milestone score.';
COMMENT ON COLUMN pediatric_assessment.grade.growth_classification IS
    'Growth parameter classification: normal, underweight, overweight, failure-to-thrive, or empty.';
COMMENT ON COLUMN pediatric_assessment.grade.environmental_risk_level IS
    'Environmental risk factor level: low, moderate, high, or empty.';
COMMENT ON COLUMN pediatric_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN pediatric_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pediatric_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pediatric_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN pediatric_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
