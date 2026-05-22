-- Validation rules that fired during the HIPAA-authorization check.

CREATE TABLE validation_fired_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    validation_result_id UUID NOT NULL
        REFERENCES validation_result(id) ON DELETE CASCADE,
    rule_id VARCHAR(60) NOT NULL,
    citation VARCHAR(80) NOT NULL DEFAULT '',
    domain VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (domain IN ('', 'core-element', 'required-statement', 'sensitive-category', 'compound', 'expiration', 'representative')),
    description TEXT NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TRIGGER trigger_validation_fired_rule_updated_at
    BEFORE UPDATE ON validation_fired_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE validation_fired_rule IS
    'Validation rules that fired during the HIPAA-authorization check. Many-to-one child of validation_result.';
COMMENT ON COLUMN validation_fired_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN validation_fired_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN validation_fired_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN validation_fired_rule.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN validation_fired_rule.validation_result_id IS
    'Foreign key to the parent validation result.';
COMMENT ON COLUMN validation_fired_rule.rule_id IS
    'Identifier of the validation rule that fired (e.g. phi-description-specific).';
COMMENT ON COLUMN validation_fired_rule.citation IS
    'Regulatory citation backing the rule (e.g. 45 CFR § 164.508(c)(1)(i)).';
COMMENT ON COLUMN validation_fired_rule.domain IS
    'Rule domain: core-element, required-statement, sensitive-category, compound, expiration, representative, or empty.';
COMMENT ON COLUMN validation_fired_rule.description IS
    'Human-readable description of what the rule checks.';
COMMENT ON COLUMN validation_fired_rule.priority IS
    'Rule priority: high, medium, or low.';
