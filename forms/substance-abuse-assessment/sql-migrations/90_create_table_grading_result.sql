CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    audit_score INTEGER
        CHECK (audit_score IS NULL OR (audit_score >= 0 AND audit_score <= 40)),
    audit_risk_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (audit_risk_category IN ('low-risk', 'hazardous', 'harmful', 'dependence-likely', '')),
    dast_score INTEGER
        CHECK (dast_score IS NULL OR (dast_score >= 0 AND dast_score <= 10)),
    dast_risk_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dast_risk_category IN ('no-problems', 'low', 'moderate', 'substantial', 'severe', '')),
    overall_risk_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_risk_level IN ('low', 'moderate', 'high', 'critical', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed substance abuse grading result. AUDIT score 0-40, DAST-10 score 0-10, and combined risk level. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.audit_score IS
    'AUDIT total score (0-40).';
COMMENT ON COLUMN grade.audit_risk_category IS
    'AUDIT risk category: low-risk, hazardous, harmful, dependence-likely, or empty.';
COMMENT ON COLUMN grade.dast_score IS
    'DAST-10 total score (0-10).';
COMMENT ON COLUMN grade.dast_risk_category IS
    'DAST risk category: no-problems, low, moderate, substantial, severe, or empty.';
COMMENT ON COLUMN grade.overall_risk_level IS
    'Overall substance abuse risk level: low, moderate, high, critical, or empty.';
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
