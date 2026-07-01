-- Audit trail of every validity rule that fired during classification. Each
-- row records one rule firing with the certificate dimension it concerns, the
-- category, and a human-readable description.

CREATE TABLE medical_certificate_of_cause_of_death_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_certificate_of_cause_of_death_grade_id UUID NOT NULL
        REFERENCES medical_certificate_of_cause_of_death_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('part-i', 'part-ii', 'referral', 'scrutiny', 'certifier', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX medical_certificate_of_cause_of_death_grade_rule_grade_id_idx
    ON medical_certificate_of_cause_of_death_grade_rule (medical_certificate_of_cause_of_death_grade_id);

CREATE TRIGGER trigger_medical_certificate_of_cause_of_death_grade_rule_updated_at
    BEFORE UPDATE ON medical_certificate_of_cause_of_death_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_certificate_of_cause_of_death_grade_rule IS
    'Audit trail of every validity rule that fired during classification: certificate dimension, category, and description.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.medical_certificate_of_cause_of_death_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-MISSING-PART-IA-01).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.dimension IS
    'Certificate dimension the rule concerns: part-i, part-ii, referral, scrutiny, certifier, or classification.';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.category IS
    'Subject category (e.g. required-component, illogical-sequence, coroner-referral).';
COMMENT ON COLUMN medical_certificate_of_cause_of_death_grade_rule.description IS
    'Human-readable description of why the rule fired.';
