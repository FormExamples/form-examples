-- Computed documentation-completeness and risk grading result for a mental
-- state examination. The engine classifies the record as complete or partial,
-- reports a completeness percentage over the seven ASEPTIC domains, and derives
-- a risk level (none / low / moderate / high) from the highest-priority safety
-- flag raised. A grade reflects the completeness of the record and the risk
-- signalled by the findings, not a diagnosis or a full risk assessment.

CREATE TABLE mental_state_examination_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mental_state_examination_id UUID NOT NULL UNIQUE
        REFERENCES mental_state_examination(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', '')),
    risk_level VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_level IN ('none', 'low', 'moderate', 'high', '')),
    completeness_percent INTEGER,

    appearance_behaviour_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (appearance_behaviour_documented IN ('yes', 'no', '')),
    speech_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (speech_documented IN ('yes', 'no', '')),
    emotion_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (emotion_documented IN ('yes', 'no', '')),
    perception_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (perception_documented IN ('yes', 'no', '')),
    thought_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (thought_documented IN ('yes', 'no', '')),
    insight_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (insight_documented IN ('yes', 'no', '')),
    cognition_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (cognition_documented IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_mental_state_examination_grade_updated_at
    BEFORE UPDATE ON mental_state_examination_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_state_examination_grade IS
    'Computed documentation-completeness and risk grading result for a mental state examination: status (complete/partial), risk level (none/low/moderate/high), completeness percentage, and per-domain documented flags.';
COMMENT ON COLUMN mental_state_examination_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_state_examination_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN mental_state_examination_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN mental_state_examination_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN mental_state_examination_grade.mental_state_examination_id IS
    'Foreign key to the parent mental state examination (unique, 1:1).';
COMMENT ON COLUMN mental_state_examination_grade.status IS
    'Completeness status: complete (all seven domains documented) or partial.';
COMMENT ON COLUMN mental_state_examination_grade.risk_level IS
    'Risk level derived from the highest-priority flag raised: none, low, moderate, or high.';
COMMENT ON COLUMN mental_state_examination_grade.completeness_percent IS
    'Completeness percentage (0..100): documented domains / 7 x 100.';
COMMENT ON COLUMN mental_state_examination_grade.appearance_behaviour_documented IS
    'Whether Domain 1 (appearance and behaviour) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.speech_documented IS
    'Whether Domain 2 (speech) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.emotion_documented IS
    'Whether Domain 3 (emotion) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.perception_documented IS
    'Whether Domain 4 (perception) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.thought_documented IS
    'Whether Domain 5 (thought) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.insight_documented IS
    'Whether Domain 6 (insight and judgement) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.cognition_documented IS
    'Whether Domain 7 (cognition) has any non-blank finding (yes/no).';
COMMENT ON COLUMN mental_state_examination_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
