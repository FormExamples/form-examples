-- Audit trail of every completeness or risk rule that fired during
-- classification. Each row records one rule firing with the bill-of-sale
-- dimension it concerns, the category, and a human-readable description.

CREATE TABLE united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_vehicle_bill_of_sale_grade_id UUID NOT NULL
        REFERENCES united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (dimension IN ('parties', 'vehicle', 'odometer', 'title-lien', 'terms', 'state-rules', 'after-sale', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_vehicle_bill_of_sale_grade_rule_grade_id_idx
    ON united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule (united_states_vehicle_bill_of_sale_grade_id);

CREATE TRIGGER trigger_united_states_vehicle_bill_of_sale_grade_rule_updated_at
    BEFORE UPDATE ON united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION united_states_vehicle_bill_of_sale.set_updated_at();

COMMENT ON TABLE united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule IS
    'Audit trail of every rule that fired during classification: bill-of-sale dimension, category, and description.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.united_states_vehicle_bill_of_sale_grade_id IS
    'Foreign key to the parent grade (cascade delete).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.rule_id IS
    'Stable rule identifier (for example R-ODO-001).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.dimension IS
    'Dimension the rule concerns: parties, vehicle, odometer, title-lien, terms, state-rules, after-sale, or classification.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.category IS
    'Machine-readable category of the rule.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale_grade_rule.description IS
    'Human-readable description of why the rule fired.';
