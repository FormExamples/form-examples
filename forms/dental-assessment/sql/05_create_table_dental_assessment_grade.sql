CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    dmft_score INTEGER NOT NULL DEFAULT 0
        CHECK (dmft_score >= 0 AND dmft_score <= 28),
    decayed_count INTEGER NOT NULL DEFAULT 0
        CHECK (decayed_count >= 0 AND decayed_count <= 28),
    missing_count INTEGER NOT NULL DEFAULT 0
        CHECK (missing_count >= 0 AND missing_count <= 28),
    filled_count INTEGER NOT NULL DEFAULT 0
        CHECK (filled_count >= 0 AND filled_count <= 28),
    severity_level VARCHAR(20) NOT NULL DEFAULT 'very_low'
        CHECK (severity_level IN ('very_low', 'low', 'moderate', 'high', 'very_high')),
    periodontal_risk VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (periodontal_risk IN ('low', 'moderate', 'high')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed DMFT grading result for dental assessment. One-to-one child of assessment.';
COMMENT ON COLUMN grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN grade.dmft_score IS
    'Total DMFT score (D + M + F), range 0-28.';
COMMENT ON COLUMN grade.decayed_count IS
    'Number of decayed teeth contributing to the score.';
COMMENT ON COLUMN grade.missing_count IS
    'Number of missing teeth contributing to the score.';
COMMENT ON COLUMN grade.filled_count IS
    'Number of filled teeth contributing to the score.';
COMMENT ON COLUMN grade.severity_level IS
    'DMFT severity classification: very_low (0-4), low (5-8), moderate (9-13), high (14-17), very_high (18+).';
COMMENT ON COLUMN grade.periodontal_risk IS
    'Overall periodontal risk level derived from the periodontal assessment.';
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
