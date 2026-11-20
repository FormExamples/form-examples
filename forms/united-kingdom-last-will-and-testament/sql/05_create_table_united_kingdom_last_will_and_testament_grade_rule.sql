-- Audit trail of every validity rule that fired during classification. Each
-- row records one rule firing with the will dimension it concerns, the
-- category, and a human-readable description.

CREATE TABLE united_kingdom_last_will_and_testament_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_last_will_and_testament_grade_id UUID NOT NULL
        REFERENCES united_kingdom_last_will_and_testament_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('testator', 'estate', 'executors', 'beneficiaries', 'execution', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_kingdom_last_will_and_testament_grade_rule_grade_id_idx
    ON united_kingdom_last_will_and_testament_grade_rule (united_kingdom_last_will_and_testament_grade_id);

CREATE TRIGGER trigger_united_kingdom_last_will_and_testament_grade_rule_updated_at
    BEFORE UPDATE ON united_kingdom_last_will_and_testament_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_last_will_and_testament_grade_rule IS
    'Audit trail of every validity rule that fired during classification: will dimension, category, and description.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.united_kingdom_last_will_and_testament_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-NO-EXECUTOR-01).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.dimension IS
    'Will dimension the rule concerns: testator, estate, executors, beneficiaries, execution, or classification.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.category IS
    'Subject category (e.g. no-executor, shares-not-100, witness-formality).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament_grade_rule.description IS
    'Human-readable description of why the rule fired.';
