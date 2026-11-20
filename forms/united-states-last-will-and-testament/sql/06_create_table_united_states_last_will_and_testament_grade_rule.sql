-- Audit trail of every validity rule that fired during classification. Each
-- row records one rule firing with the will dimension it concerns, the
-- category, and a human-readable description.

CREATE TABLE united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_last_will_and_testament_grade_id UUID NOT NULL
        REFERENCES united_states_last_will_and_testament.united_states_last_will_and_testament_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('capacity', 'execution', 'witnesses', 'bequests', 'family', 'fiduciary', 'jurisdiction', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_last_will_and_testament_grade_rule_grade_id_idx
    ON united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule (united_states_last_will_and_testament_grade_id);

CREATE TRIGGER trigger_united_states_last_will_and_testament_grade_rule_updated_at
    BEFORE UPDATE ON united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION united_states_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule IS
    'Audit trail of every validity rule that fired during classification: will dimension, category, and description.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.united_states_last_will_and_testament_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-WITNESS-COUNT-01).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.dimension IS
    'Will dimension the rule concerns: capacity, execution, witnesses, bequests, family, fiduciary, jurisdiction, or classification.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.category IS
    'Subject category (e.g. witness-count, residuary-total, elective-share).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_rule.description IS
    'Human-readable description of why the rule fired.';
