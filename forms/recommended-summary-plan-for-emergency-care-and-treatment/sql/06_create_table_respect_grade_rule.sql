-- Audit trail of every mandatory rule evaluated during grading. Each row
-- records one mandatory rule (spec section 4, R1..R8), the plan section it
-- concerns, whether it was satisfied, and a human-readable description.

CREATE TABLE respect_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    respect_grade_id UUID NOT NULL
        REFERENCES respect_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    section VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (section IN (
            'identity',
            'health',
            'preferences',
            'recommendations',
            'cpr',
            'ceilings',
            'capacity',
            'sign-off',
            'completeness',
            ''
        )),
    satisfied VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (satisfied IN ('yes', 'no', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX respect_grade_rule_grade_id_idx
    ON respect_grade_rule (respect_grade_id);

CREATE TRIGGER trigger_respect_grade_rule_updated_at
    BEFORE UPDATE ON respect_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE respect_grade_rule IS
    'Audit trail of every mandatory rule evaluated during grading: rule identifier, plan section, whether it was satisfied, category, and description.';
COMMENT ON COLUMN respect_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN respect_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN respect_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN respect_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN respect_grade_rule.respect_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN respect_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R1-IDENTITY, R5-CPR).';
COMMENT ON COLUMN respect_grade_rule.section IS
    'Plan section the rule concerns: identity, health, preferences, recommendations, cpr, ceilings, capacity, sign-off, or completeness.';
COMMENT ON COLUMN respect_grade_rule.satisfied IS
    'Whether the mandatory rule was satisfied (yes/no).';
COMMENT ON COLUMN respect_grade_rule.category IS
    'Subject category (e.g. mandatory-rule, conditional-requirement).';
COMMENT ON COLUMN respect_grade_rule.description IS
    'Human-readable description of the rule and why it passed or failed.';
