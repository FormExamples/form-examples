-- Audit trail of every readiness rule that fired during classification. Each
-- row records one rule firing with the directive dimension it concerns, the
-- category, and a human-readable description.

CREATE TABLE united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    united_states_health_care_power_of_attorney_grade_id UUID NOT NULL
        REFERENCES united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('principal', 'agent', 'authority', 'wishes', 'execution', 'distribution', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_health_care_power_of_attorney_grade_rule_grade_id_idx
    ON united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule (united_states_health_care_power_of_attorney_grade_id);
CREATE TRIGGER trigger_united_states_health_care_power_of_attorney_grade_rule_updated_at
    BEFORE UPDATE ON united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION united_states_health_care_power_of_attorney.set_updated_at();

COMMENT ON TABLE united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule IS
    'Audit trail of every readiness rule that fired during classification: directive dimension, category, and description.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.united_states_health_care_power_of_attorney_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-WITNESS-COUNT-01).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.dimension IS
    'Directive dimension the rule concerns: principal, agent, authority, wishes, execution, distribution, or classification.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.category IS
    'Subject category (e.g. witness-eligibility, required-field).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.united_states_health_care_power_of_attorney_grade_rule.description IS
    'Human-readable description of why the rule fired.';
