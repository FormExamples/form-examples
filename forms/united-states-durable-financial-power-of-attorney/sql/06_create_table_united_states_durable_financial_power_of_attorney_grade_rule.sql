-- Audit trail of every classification rule that fired: the instrument
-- dimension, the category, and a description.

CREATE TABLE united_states_durable_financial_power_of_attorney_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_durable_financial_power_of_attorney_grade_id UUID NOT NULL
        REFERENCES united_states_durable_financial_power_of_attorney_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT '' CHECK (dimension IN ('execution', 'effectiveness', 'authority', 'agent', 'acceptance', 'jurisdiction', 'completeness', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX dpoa_grade_rule_grade_id_idx
    ON united_states_durable_financial_power_of_attorney_grade_rule (united_states_durable_financial_power_of_attorney_grade_id);

CREATE TRIGGER trigger_dpoa_grade_rule_updated_at
    BEFORE UPDATE ON united_states_durable_financial_power_of_attorney_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_durable_financial_power_of_attorney_grade_rule IS
    'Audit trail of every classification rule that fired: instrument dimension, category, and description.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.united_states_durable_financial_power_of_attorney_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-NOTARY-MISSING-01).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.dimension IS
    'Instrument dimension the rule concerns: execution, effectiveness, authority, agent, acceptance, jurisdiction, completeness, or classification.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.category IS
    'Subject category of the rule.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney_grade_rule.description IS
    'Human-readable description of why the rule fired.';
