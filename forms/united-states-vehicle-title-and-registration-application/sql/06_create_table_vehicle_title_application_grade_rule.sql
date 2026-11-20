-- Audit trail of every classification rule that fired. Each row records one rule
-- firing with the application dimension it concerns, the category, and a
-- human-readable description.

CREATE TABLE vehicle_title_application_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    vehicle_title_application_grade_id UUID NOT NULL REFERENCES vehicle_title_application_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(14) NOT NULL DEFAULT '' CHECK (dimension IN ('vin', 'odometer', 'brand', 'lien', 'owner', 'state', 'compliance', 'tax', 'classification', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX vehicle_title_application_grade_rule_grade_id_idx
    ON vehicle_title_application_grade_rule (vehicle_title_application_grade_id);

CREATE TRIGGER trigger_vehicle_title_application_grade_rule_updated_at
    BEFORE UPDATE ON vehicle_title_application_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE vehicle_title_application_grade_rule IS
    'Audit trail of every classification rule that fired: application dimension, category, and description.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.vehicle_title_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-BRAND-PRESENT-01).';
COMMENT ON COLUMN vehicle_title_application_grade_rule.dimension IS
    'Application dimension the rule concerns: vin, odometer, brand, lien, owner, state, compliance, tax, or classification.';
COMMENT ON COLUMN vehicle_title_application_grade_rule.category IS
    'Subject category (e.g. required-component, brand, outstanding-item).';
COMMENT ON COLUMN vehicle_title_application_grade_rule.description IS
    'Human-readable description of why the rule fired.';
