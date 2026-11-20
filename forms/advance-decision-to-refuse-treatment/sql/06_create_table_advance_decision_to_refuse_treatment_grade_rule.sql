CREATE TABLE advance_decision_to_refuse_treatment.grading_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES advance_decision_to_refuse_treatment.grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    validity_level VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (validity_level IN ('valid', 'invalid', 'incomplete', ''))
);

CREATE TRIGGER trigger_grading_fired_rule_updated_at
    BEFORE UPDATE ON advance_decision_to_refuse_treatment.grading_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION advance_decision_to_refuse_treatment.set_updated_at();

COMMENT ON TABLE advance_decision_to_refuse_treatment.grading_fired_rule IS
    'Individual validity rules that evaluated to true during advance decision grading.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.grade_id IS
    'Foreign key to the parent grading result.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.rule_id IS
    'Identifier of the rule that fired (e.g. VAL-001, CAP-002).';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.category IS
    'Category of the rule (e.g. Capacity, Signature, Life-Sustaining, Witness).';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.description IS
    'Human-readable description of the rule condition.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.validity_level IS
    'Validity level contributed by this rule: valid, invalid, or incomplete.';

COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN advance_decision_to_refuse_treatment.grading_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
