CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    cmai_score INTEGER
        CHECK (cmai_score IS NULL OR (cmai_score >= 29 AND cmai_score <= 203)),
    npi_total_score INTEGER
        CHECK (npi_total_score IS NULL OR (npi_total_score >= 0 AND npi_total_score <= 144)),
    overall_severity VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_severity IN ('mild', 'moderate', 'severe', 'critical', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed sundowner syndrome grading result. CMAI score 29-203 and NPI score 0-144 with overall severity classification. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.cmai_score IS
    'Cohen-Mansfield Agitation Inventory total score (29-203).';
COMMENT ON COLUMN grade.npi_total_score IS
    'Neuropsychiatric Inventory total score (0-144).';
COMMENT ON COLUMN grade.overall_severity IS
    'Overall sundowner severity: mild, moderate, severe, critical, or empty.';
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
