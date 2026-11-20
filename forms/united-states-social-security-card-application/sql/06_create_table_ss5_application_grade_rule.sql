-- Audit trail of every rule that fired during classification. Each
-- row records one rule firing with the application dimension it concerns, the
-- category, and a human-readable description.

CREATE TABLE ss5_application_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ss5_application_grade_id UUID NOT NULL
        REFERENCES ss5_application_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('eligibility', 'limits', 'form-fields', 'evidence', 'signature', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX ss5_application_grade_rule_grade_id_idx
    ON ss5_application_grade_rule (ss5_application_grade_id);

CREATE TRIGGER trigger_ss5_application_grade_rule_updated_at
    BEFORE UPDATE ON ss5_application_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ss5_application_grade_rule IS
    'Audit trail of every rule that fired during classification: application dimension, category, and description.';
COMMENT ON COLUMN ss5_application_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ss5_application_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ss5_application_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ss5_application_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ss5_application_grade_rule.ss5_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ss5_application_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-IDENTITY-EVIDENCE-01).';
COMMENT ON COLUMN ss5_application_grade_rule.dimension IS
    'Application dimension the rule concerns: eligibility, limits, form-fields, evidence, signature, or classification.';
COMMENT ON COLUMN ss5_application_grade_rule.category IS
    'Subject category (e.g. identity-evidence, replacement-limit, required-field).';
COMMENT ON COLUMN ss5_application_grade_rule.description IS
    'Human-readable description of why the rule fired.';
