-- Applicant: the property owner who files the homestead exemption application
-- with the county assessor.

CREATE TABLE united_states_property_tax_exemption_application.applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state VARCHAR(2) NOT NULL DEFAULT '',
    zip_code TEXT
);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON united_states_property_tax_exemption_application.applicant
    FOR EACH ROW
    EXECUTE FUNCTION united_states_property_tax_exemption_application.set_updated_at();

COMMENT ON TABLE united_states_property_tax_exemption_application.applicant IS
    'Applicant (property owner) who files a United States residential property tax exemption application.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.name IS
    'Applicant full legal name.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.email IS
    'Applicant email address.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.phone IS
    'Applicant telephone number.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.postal_address_as_full_text IS
    'Applicant mailing address as free text.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.state IS
    'Two-letter US state or territory code of the mailing address.';
COMMENT ON COLUMN united_states_property_tax_exemption_application.applicant.zip_code IS
    'ZIP or ZIP+4 code of the mailing address.';
