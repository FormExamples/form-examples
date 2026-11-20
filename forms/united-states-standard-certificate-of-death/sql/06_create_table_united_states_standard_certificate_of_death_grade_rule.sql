-- Rules that fired while classifying one certificate.

CREATE TABLE united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    united_states_standard_certificate_of_death_grade_id UUID NOT NULL
        REFERENCES united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('part-i', 'part-ii', 'manner', 'referral', 'decedent', 'certifier', 'disposition', 'copies', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX usscd_grade_rule_grade_id_idx
    ON united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule (united_states_standard_certificate_of_death_grade_id);

CREATE TRIGGER trigger_united_states_standard_certificate_of_death_grade_rule_updated_at
    BEFORE UPDATE ON united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION united_states_standard_certificate_of_death.set_updated_at();

COMMENT ON TABLE united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule IS
    'Audit trail of every validity rule that fired during classification: certificate dimension, category, and description.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.united_states_standard_certificate_of_death_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-MISSING-PART-IA-01).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.dimension IS
    'Certificate dimension the rule concerns: part-i, part-ii, manner, referral, decedent, certifier, disposition, copies, or classification.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.category IS
    'Subject category (e.g. required-component, mechanism-of-death, referral-criterion).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_rule.description IS
    'Human-readable description of why the rule fired.';
