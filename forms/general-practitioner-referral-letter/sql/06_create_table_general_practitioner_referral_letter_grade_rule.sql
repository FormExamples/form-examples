-- Audit trail of every completeness rule that fired during grading. Each
-- row records one rule firing with its category and a human-readable
-- description.

CREATE TABLE general_practitioner_referral_letter_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    general_practitioner_referral_letter_grade_id UUID NOT NULL
        REFERENCES general_practitioner_referral_letter_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX general_practitioner_referral_letter_grade_rule_grade_id_idx
    ON general_practitioner_referral_letter_grade_rule (general_practitioner_referral_letter_grade_id);

CREATE TRIGGER trigger_general_practitioner_referral_letter_grade_rule_updated_at
    BEFORE UPDATE ON general_practitioner_referral_letter_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE general_practitioner_referral_letter_grade_rule IS
    'Audit trail of every completeness rule that fired during grading: category and description.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.general_practitioner_referral_letter_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-MANDATORY-URGENCY-01).';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.category IS
    'Subject category (e.g. mandatory-field, conditional-requirement, urgency-classification).';
COMMENT ON COLUMN general_practitioner_referral_letter_grade_rule.description IS
    'Human-readable description of why the rule fired.';
