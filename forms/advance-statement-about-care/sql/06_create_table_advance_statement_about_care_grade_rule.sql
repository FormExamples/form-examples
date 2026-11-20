CREATE TABLE advance_statement_about_care.grading_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES advance_statement_about_care.grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    completeness_level VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (completeness_level IN ('complete', 'partial', 'incomplete', ''))
);

CREATE TRIGGER trigger_grading_fired_rule_updated_at
    BEFORE UPDATE ON advance_statement_about_care.grading_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION advance_statement_about_care.set_updated_at();

COMMENT ON TABLE advance_statement_about_care.grading_fired_rule IS
    'Individual completeness rules that evaluated to true during advance statement grading.';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.grade_id IS
    'Foreign key to the parent grading result.';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.rule_id IS
    'Identifier of the rule that fired (e.g. CMP-001, VAL-002).';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.category IS
    'Category of the rule (e.g. Personal Information, Values, Care Preferences, Signatures).';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.description IS
    'Human-readable description of the rule condition.';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.completeness_level IS
    'Completeness level contributed by this rule: complete, partial, or incomplete.';

COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN advance_statement_about_care.grading_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
