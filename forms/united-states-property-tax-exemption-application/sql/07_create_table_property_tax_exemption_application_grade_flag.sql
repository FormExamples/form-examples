-- Flagged issues raised independently of the class, with a priority and a
-- suggested action for the applicant or the assessor.

CREATE TABLE property_tax_exemption_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    property_tax_exemption_application_grade_id UUID NOT NULL REFERENCES property_tax_exemption_application_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '' CHECK (category IN ('ownership','occupancy','duplicate-homestead','late-filing','age-requirement','income-limit','veteran-rating','no-exemption-claimed','missing-information','missing-documents','missing-signature','state-rule-verify','appeal-guidance','other','')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX property_tax_exemption_application_grade_flag_grade_id_idx
    ON property_tax_exemption_application_grade_flag (property_tax_exemption_application_grade_id);

CREATE TRIGGER trigger_property_tax_exemption_application_grade_flag_updated_at
    BEFORE UPDATE ON property_tax_exemption_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE property_tax_exemption_application_grade_flag IS
    'Flagged issues raised independently of the eligibility class, with priority and a suggested action for the applicant or assessor.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.property_tax_exemption_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-OWNERSHIP-001).';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN property_tax_exemption_application_grade_flag.suggested_action IS
    'Suggested action (e.g. "file before the state deadline", "attach proof of age").';
