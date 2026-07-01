-- Audit trail of every decision rule that was evaluated during Ottawa Knee
-- Rule computation. Each row records one criterion (or the composite decision)
-- with the instrument that produced it, whether it fired, the criterion it
-- relates to, and a human-readable description. Because this is an ANY-of
-- decision rule there is no score; the audit records which criteria fired.

CREATE TABLE ottawa_knee_rule_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ottawa_knee_rule_grade_id UUID NOT NULL
        REFERENCES ottawa_knee_rule_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('criterion', 'composite', '')),
    criterion VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (criterion IN (
            'age',
            'isolated-patellar-tenderness',
            'fibular-head-tenderness',
            'flexion',
            'weight-bearing',
            'decision',
            'other',
            ''
        )),
    fired BOOLEAN NOT NULL DEFAULT false,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX ottawa_knee_rule_grade_rule_grade_id_idx
    ON ottawa_knee_rule_grade_rule (ottawa_knee_rule_grade_id);

CREATE TRIGGER trigger_ottawa_knee_rule_grade_rule_updated_at
    BEFORE UPDATE ON ottawa_knee_rule_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_knee_rule_grade_rule IS
    'Audit trail of every decision rule evaluated during Ottawa Knee Rule computation: instrument, criterion, whether it fired, category, and description.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.ottawa_knee_rule_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-AGE-01, R-ISOLATED-PATELLAR-01).';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.instrument IS
    'Decision instrument the rule belongs to: criterion (one of the five) or composite (the ANY-of decision).';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.criterion IS
    'Criterion the rule relates to: age, isolated-patellar-tenderness, fibular-head-tenderness, flexion, weight-bearing, or decision.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.fired IS
    'Whether this criterion was present (true) and therefore contributed to indicating imaging.';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.category IS
    'Subject category (e.g. age, bony-tenderness, range-of-motion, weight-bearing, decision).';
COMMENT ON COLUMN ottawa_knee_rule_grade_rule.description IS
    'Human-readable description of why the rule fired or did not fire.';
