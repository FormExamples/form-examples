-- Audit trail of every readiness rule that fired during classification.

CREATE TABLE united_states_divorce_petition.united_states_divorce_petition_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_divorce_petition_grade_id UUID NOT NULL
        REFERENCES united_states_divorce_petition.united_states_divorce_petition_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('eligibility', 'residency', 'children', 'property', 'service', 'decree', 'state', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_divorce_petition_grade_rule_grade_id_idx
    ON united_states_divorce_petition.united_states_divorce_petition_grade_rule (united_states_divorce_petition_grade_id);

CREATE TRIGGER trigger_united_states_divorce_petition_grade_rule_updated_at
    BEFORE UPDATE ON united_states_divorce_petition.united_states_divorce_petition_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION united_states_divorce_petition.set_updated_at();

COMMENT ON TABLE united_states_divorce_petition.united_states_divorce_petition_grade_rule IS
    'Audit trail of every readiness rule that fired during classification.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.united_states_divorce_petition_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.rule_id IS
    'Stable rule identifier (for example R-RESIDENCY-001).';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.dimension IS
    'Petition dimension the rule concerns: eligibility, residency, children, property, service, decree, state, classification.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.category IS
    'Rule category.';
COMMENT ON COLUMN united_states_divorce_petition.united_states_divorce_petition_grade_rule.description IS
    'Human-readable description of the rule that fired.';
