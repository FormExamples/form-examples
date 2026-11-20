-- Audit trail of every eligibility rule that fired. Each row records one rule
-- with the application dimension it concerns, the category and a description.

CREATE TABLE property_tax_exemption_application_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    property_tax_exemption_application_grade_id UUID NOT NULL REFERENCES property_tax_exemption_application_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT '' CHECK (dimension IN ('ownership', 'occupancy', 'exemption', 'income', 'documents', 'filing', 'declaration', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX property_tax_exemption_application_grade_rule_grade_id_idx
    ON property_tax_exemption_application_grade_rule (property_tax_exemption_application_grade_id);

CREATE TRIGGER trigger_property_tax_exemption_application_grade_rule_updated_at
    BEFORE UPDATE ON property_tax_exemption_application_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE property_tax_exemption_application_grade_rule IS
    'Audit trail of every eligibility rule that fired during classification: application dimension, category and description.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.property_tax_exemption_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-OWNERSHIP-01).';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.dimension IS
    'Application dimension the rule concerns.';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.category IS
    'Subject category (e.g. base-eligibility, state-rule).';
COMMENT ON COLUMN property_tax_exemption_application_grade_rule.description IS
    'Human-readable description of why the rule fired.';
