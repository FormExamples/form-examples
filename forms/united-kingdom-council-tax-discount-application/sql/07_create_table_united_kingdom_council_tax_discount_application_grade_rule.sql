-- Audit trail of every eligibility rule that fired during classification, with
-- the application dimension it concerns, the category and a description.

CREATE TABLE united_kingdom_council_tax_discount_application_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_council_tax_discount_application_grade_id UUID NOT NULL REFERENCES united_kingdom_council_tax_discount_application_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT '' CHECK (dimension IN ('claim', 'household', 'evidence', 'property', 'declaration', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_united_kingdom_council_tax_discount_application_grade_rule_updated_at
    BEFORE UPDATE ON united_kingdom_council_tax_discount_application_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_council_tax_discount_application_grade_rule IS
    'Audit trail of every eligibility rule that fired during classification, with the application dimension it concerns, the category and a description.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.united_kingdom_council_tax_discount_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.rule_id IS
    'Stable identifier of the rule that fired.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.dimension IS
    'Application dimension the rule concerns.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.category IS
    'Rule category.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_rule.description IS
    'Human-readable description of the rule that fired.';

CREATE INDEX ukctda_grade_rule_ukctda_grade_id_idx
    ON united_kingdom_council_tax_discount_application_grade_rule (united_kingdom_council_tax_discount_application_grade_id);
