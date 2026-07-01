-- Audit trail of every completeness-and-risk rule that fired during grading.
-- Each row records one rule firing with the domain it concerns, the category,
-- and a human-readable description.

CREATE TABLE mental_state_examination_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mental_state_examination_grade_id UUID NOT NULL
        REFERENCES mental_state_examination_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    domain VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (domain IN (
            'appearance-behaviour',
            'speech',
            'emotion',
            'perception',
            'thought',
            'insight',
            'cognition',
            'completeness',
            'risk',
            ''
        )),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX mental_state_examination_grade_rule_grade_id_idx
    ON mental_state_examination_grade_rule (mental_state_examination_grade_id);

CREATE TRIGGER trigger_mental_state_examination_grade_rule_updated_at
    BEFORE UPDATE ON mental_state_examination_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_state_examination_grade_rule IS
    'Audit trail of every completeness-and-risk rule that fired during grading: domain, category, and description.';
COMMENT ON COLUMN mental_state_examination_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_state_examination_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN mental_state_examination_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN mental_state_examination_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN mental_state_examination_grade_rule.mental_state_examination_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN mental_state_examination_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-THOUGHT-DOCUMENTED-01).';
COMMENT ON COLUMN mental_state_examination_grade_rule.domain IS
    'ASEPTIC domain the rule concerns: appearance-behaviour, speech, emotion, perception, thought, insight, cognition, or the cross-cutting completeness or risk.';
COMMENT ON COLUMN mental_state_examination_grade_rule.category IS
    'Subject category (e.g. domain-documented, risk-flag, completeness).';
COMMENT ON COLUMN mental_state_examination_grade_rule.description IS
    'Human-readable description of why the rule fired.';
