CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id           UUID NOT NULL UNIQUE REFERENCES assessment(id) ON DELETE CASCADE,
    -- Computed REBA score (1-15)
    reba_score              INTEGER NOT NULL CHECK (reba_score >= 1 AND reba_score <= 15),
    -- Risk level derived from REBA score
    risk_level              TEXT NOT NULL
                            CHECK (risk_level IN (
                                'Negligible risk', 'Low risk', 'Medium risk',
                                'High risk', 'Very high risk'
                            )),
    -- Optional clinician override
    reba_score_override     INTEGER CHECK (reba_score_override IS NULL OR (reba_score_override >= 1 AND reba_score_override <= 15)),
    override_reason         TEXT NOT NULL DEFAULT '',
    -- When the grading was computed
    graded_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- If override is set, a reason must be provided
    CONSTRAINT chk_override_reason CHECK (
        reba_score_override IS NULL OR override_reason != ''
    )
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed REBA grading result for an assessment. Includes optional clinician override.';
COMMENT ON COLUMN grade.reba_score IS
    'Computed REBA score (1-15), sum of fired rule scores clamped to range.';
COMMENT ON COLUMN grade.risk_level IS
    'Risk level derived from REBA score: Negligible, Low, Medium, High, or Very high risk.';
COMMENT ON COLUMN grade.reba_score_override IS
    'Clinician override of the computed REBA score. NULL if no override.';
COMMENT ON COLUMN grade.override_reason IS
    'Required reason text when reba_score_override is set.';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp when the REBA grading was computed.';

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
