-- Applicant: the property owner who files the homestead exemption application
-- with the county assessor.

CREATE TABLE applicant (
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
    BEFORE UPDATE ON applicant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE applicant IS
    'Applicant (property owner) who files a United States residential property tax exemption application.';
COMMENT ON COLUMN applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN applicant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN applicant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN applicant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN applicant.name IS
    'Applicant full legal name.';
COMMENT ON COLUMN applicant.email IS
    'Applicant email address.';
COMMENT ON COLUMN applicant.phone IS
    'Applicant telephone number.';
COMMENT ON COLUMN applicant.postal_address_as_full_text IS
    'Applicant mailing address as free text.';
COMMENT ON COLUMN applicant.state IS
    'Two-letter US state or territory code of the mailing address.';
COMMENT ON COLUMN applicant.zip_code IS
    'ZIP or ZIP+4 code of the mailing address.';
