CREATE TABLE dyslexia_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES dyslexia_assessment.assessment(id) ON DELETE CASCADE,
    severity_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (severity_level IN ('none', 'mild', 'moderate', 'severe', '')),
    lowest_domain_score INTEGER
        CHECK (lowest_domain_score IS NULL OR (lowest_domain_score >= 40 AND lowest_domain_score <= 160)),
    lowest_domain_name VARCHAR(100) NOT NULL DEFAULT '',
    overall_risk_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_risk_level IN ('low', 'moderate', 'high', 'critical', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON dyslexia_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION dyslexia_assessment.set_updated_at();

COMMENT ON TABLE dyslexia_assessment.grade IS
    'Computed dyslexia severity grading result. Severity: none (85-115), mild (70-84), moderate (55-69), severe (<55). One-to-one child of assessment.';
COMMENT ON COLUMN dyslexia_assessment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN dyslexia_assessment.grade.severity_level IS
    'Dyslexia severity level: none, mild, moderate, severe, or empty.';
COMMENT ON COLUMN dyslexia_assessment.grade.lowest_domain_score IS
    'The lowest standardised score across all assessed domains.';
COMMENT ON COLUMN dyslexia_assessment.grade.lowest_domain_name IS
    'Name of the domain with the lowest standardised score.';
COMMENT ON COLUMN dyslexia_assessment.grade.overall_risk_level IS
    'Overall risk level: low, moderate, high, critical, or empty.';
COMMENT ON COLUMN dyslexia_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN dyslexia_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dyslexia_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN dyslexia_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN dyslexia_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
