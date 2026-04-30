CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,
    mrs_total_score INTEGER NOT NULL DEFAULT 0
        CHECK (mrs_total_score >= 0 AND mrs_total_score <= 44),
    somatic_subscale_score INTEGER NOT NULL DEFAULT 0
        CHECK (somatic_subscale_score >= 0 AND somatic_subscale_score <= 16),
    psychological_subscale_score INTEGER NOT NULL DEFAULT 0
        CHECK (psychological_subscale_score >= 0 AND psychological_subscale_score <= 16),
    urogenital_subscale_score INTEGER NOT NULL DEFAULT 0
        CHECK (urogenital_subscale_score >= 0 AND urogenital_subscale_score <= 12),
    overall_severity VARCHAR(15) NOT NULL DEFAULT 'none'
        CHECK (overall_severity IN ('none', 'mild', 'moderate', 'severe')),
    hrt_eligibility VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (hrt_eligibility IN ('eligible', 'eligible-with-caution', 'contraindicated', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed Menopause Rating Scale result with HRT eligibility determination. One-to-one child of assessment.';
COMMENT ON COLUMN grade.mrs_total_score IS
    'MRS total score across all 11 items (0-44).';
COMMENT ON COLUMN grade.somatic_subscale_score IS
    'Somatic subscale score (hot flushes, heart, sleep, joint/muscle), range 0-16.';
COMMENT ON COLUMN grade.psychological_subscale_score IS
    'Psychological subscale score (depressive mood, irritability, anxiety, exhaustion), range 0-16.';
COMMENT ON COLUMN grade.urogenital_subscale_score IS
    'Urogenital subscale score (sexual, bladder, vaginal dryness), range 0-12.';
COMMENT ON COLUMN grade.overall_severity IS
    'Overall symptom severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN grade.hrt_eligibility IS
    'HRT eligibility: eligible, eligible-with-caution, contraindicated, or empty string.';
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
