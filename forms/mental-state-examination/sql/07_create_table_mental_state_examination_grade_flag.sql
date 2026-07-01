-- Safety flags that fire independently of the completeness status, each with a
-- priority and a suggested action for the clinician or crisis / safeguarding
-- team. The risk level on the grade is the highest priority present here.

CREATE TABLE mental_state_examination_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mental_state_examination_grade_id UUID NOT NULL
        REFERENCES mental_state_examination_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'suicidal-ideation',
            'homicidal-ideation',
            'command-hallucinations',
            'self-harm',
            'psychosis-with-risk',
            'lack-of-insight-with-risk',
            'cognitive-impairment',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'moderate', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX mental_state_examination_grade_flag_grade_id_idx
    ON mental_state_examination_grade_flag (mental_state_examination_grade_id);

CREATE TRIGGER trigger_mental_state_examination_grade_flag_updated_at
    BEFORE UPDATE ON mental_state_examination_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_state_examination_grade_flag IS
    'Safety flags that fire independently of the completeness status, with priority and a suggested action for the clinician or crisis / safeguarding team. The risk level on the grade is the highest priority present here.';
COMMENT ON COLUMN mental_state_examination_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_state_examination_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN mental_state_examination_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN mental_state_examination_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN mental_state_examination_grade_flag.mental_state_examination_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN mental_state_examination_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SUICIDAL-IDEATION-001).';
COMMENT ON COLUMN mental_state_examination_grade_flag.category IS
    'Flag category: suicidal-ideation, homicidal-ideation, command-hallucinations, self-harm, psychosis-with-risk, lack-of-insight-with-risk, cognitive-impairment, incomplete, or other.';
COMMENT ON COLUMN mental_state_examination_grade_flag.priority IS
    'Priority: low, moderate, high.';
COMMENT ON COLUMN mental_state_examination_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN mental_state_examination_grade_flag.suggested_action IS
    'Suggested clinical or safeguarding action (e.g. "complete a full risk assessment and escalate").';
