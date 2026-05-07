CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    asa_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (asa_class IN ('I', 'II', 'III', 'IV', 'V', '')),
    wound_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (wound_class IN ('clean', 'clean-contaminated', 'contaminated', 'dirty', '')),
    complexity_score VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (complexity_score IN ('1', '2', '3', '4', '')),
    overall_risk_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_risk_level IN ('low', 'moderate', 'high', 'critical', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed plastic surgery grading result. ASA Class I-V, Wound Classification, and Surgical Complexity. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.asa_class IS
    'ASA Physical Status Classification: I, II, III, IV, V, or empty.';
COMMENT ON COLUMN grade.wound_class IS
    'CDC Wound Classification: clean, clean-contaminated, contaminated, dirty, or empty.';
COMMENT ON COLUMN grade.complexity_score IS
    'Surgical complexity score: 1 (minor), 2 (intermediate), 3 (major), 4 (major plus/emergency), or empty.';
COMMENT ON COLUMN grade.overall_risk_level IS
    'Overall surgical risk level: low, moderate, high, critical, or empty.';
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
