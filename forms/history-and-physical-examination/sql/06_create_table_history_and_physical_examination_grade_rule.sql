-- Audit trail of every completeness rule that fired during grading. Each
-- row records one rule firing with the section it concerns, the category,
-- and a human-readable description.

CREATE TABLE history_and_physical_examination_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    history_and_physical_examination_grade_id UUID NOT NULL
        REFERENCES history_and_physical_examination_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    section VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (section IN ('history', 'examination', 'vitals', 'impression', 'plan', 'completeness', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX history_and_physical_examination_grade_rule_grade_id_idx
    ON history_and_physical_examination_grade_rule (history_and_physical_examination_grade_id);

CREATE TRIGGER trigger_history_and_physical_examination_grade_rule_updated_at
    BEFORE UPDATE ON history_and_physical_examination_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE history_and_physical_examination_grade_rule IS
    'Audit trail of every completeness rule that fired during grading: section, category, and description.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.history_and_physical_examination_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-HISTORY-PRESENT-01).';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.section IS
    'Clerking section the rule concerns: history, examination, vitals, impression, plan, or completeness.';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.category IS
    'Subject category (e.g. required-component, blocking-flag).';
COMMENT ON COLUMN history_and_physical_examination_grade_rule.description IS
    'Human-readable description of why the rule fired.';
