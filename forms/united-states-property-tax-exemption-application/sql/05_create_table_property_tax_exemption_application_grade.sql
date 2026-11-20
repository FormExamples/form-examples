-- Computed eligibility result for a property tax exemption application: likely
-- eligible, incomplete, or likely ineligible, with the state filing deadline and
-- whether the application is late. This is documentation support, not legal
-- advice; the county assessor decides.

CREATE TABLE property_tax_exemption_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    property_tax_exemption_application_id UUID NOT NULL UNIQUE REFERENCES property_tax_exemption_application(id) ON DELETE CASCADE,
    eligibility_class VARCHAR(20) NOT NULL DEFAULT '' CHECK (eligibility_class IN ('likely-eligible', 'incomplete', 'likely-ineligible', '')),
    filing_deadline DATE,
    filed_late VARCHAR(5) NOT NULL DEFAULT '' CHECK (filed_late IN ('yes', 'no', '')),
    qualifying_exemptions TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_property_tax_exemption_application_grade_updated_at
    BEFORE UPDATE ON property_tax_exemption_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE property_tax_exemption_application_grade IS
    'Computed eligibility result for a property tax exemption application: class (likely-eligible/incomplete/likely-ineligible), state filing deadline, late flag and qualifying exemptions.';
COMMENT ON COLUMN property_tax_exemption_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN property_tax_exemption_application_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN property_tax_exemption_application_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN property_tax_exemption_application_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN property_tax_exemption_application_grade.property_tax_exemption_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN property_tax_exemption_application_grade.eligibility_class IS
    'Eligibility classification: likely-eligible, incomplete, or likely-ineligible (likely-ineligible takes precedence).';
COMMENT ON COLUMN property_tax_exemption_application_grade.filing_deadline IS
    'Filing deadline derived from the state rule for the assessment year; null when the state has none or is unknown.';
COMMENT ON COLUMN property_tax_exemption_application_grade.filed_late IS
    'Whether the filing date is after the state filing deadline (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application_grade.qualifying_exemptions IS
    'Comma-separated exemptions claimed that pass the state age, income and rating tests.';
COMMENT ON COLUMN property_tax_exemption_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
