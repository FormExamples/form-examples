-- Per-grade record of which scoring rules fired during eligibility evaluation.

CREATE TABLE grade_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    grade_id UUID NOT NULL
        REFERENCES grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(64) NOT NULL DEFAULT '',
    category VARCHAR(32) NOT NULL DEFAULT '' CHECK (category IN (
        'eligible-condition',
        'disqualifying',
        'redirect',
        'completeness',
        'renewal',
        ''
    )),
    description TEXT NOT NULL DEFAULT '',
    severity_level VARCHAR(16) NOT NULL DEFAULT '' CHECK (severity_level IN ('info', 'low', 'medium', 'high', '')),
    contributing_condition_code TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_grade_fired_rule_updated_at
    BEFORE UPDATE ON grade_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade_fired_rule IS
    'Audit trail of rules that fired when computing an eligibility grade.';
COMMENT ON COLUMN grade_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade_fired_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN grade_fired_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN grade_fired_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN grade_fired_rule.grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN grade_fired_rule.rule_id IS
    'Stable identifier of the rule that fired.';
COMMENT ON COLUMN grade_fired_rule.category IS
    'Rule category: eligible-condition, disqualifying, redirect, completeness, renewal.';
COMMENT ON COLUMN grade_fired_rule.description IS
    'Human-readable description of why the rule fired.';
COMMENT ON COLUMN grade_fired_rule.severity_level IS
    'Severity level for sorting / display.';
COMMENT ON COLUMN grade_fired_rule.contributing_condition_code IS
    'Optional eligible-condition code the rule was evaluated against.';
