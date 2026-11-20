-- The owner of the vehicle named on the application: an individual or a
-- business that will appear on the certificate of title.

CREATE TABLE applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    owner_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (owner_type IN ('individual', 'business', '')),
    birth_date DATE,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state_code VARCHAR(2) NOT NULL DEFAULT '',
    postcode TEXT,
    identification_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (identification_type IN ('drivers-license', 'state-id', 'passport', 'fein', 'other', '')),
    identification_number TEXT NOT NULL DEFAULT ''
);

CREATE INDEX applicant_name_trgm_idx
    ON applicant
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON applicant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE applicant IS
    'The owner of the vehicle named on a vehicle title and registration application: an individual or a business.';
COMMENT ON COLUMN applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN applicant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN applicant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN applicant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN applicant.name IS
    'Full legal name of the owner (an individual or a business).';
COMMENT ON COLUMN applicant.owner_type IS
    'Owner type: individual or business.';
COMMENT ON COLUMN applicant.birth_date IS
    'Date of birth of an individual owner; empty for a business.';
COMMENT ON COLUMN applicant.email IS
    'Email address.';
COMMENT ON COLUMN applicant.phone IS
    'Phone number.';
COMMENT ON COLUMN applicant.postal_address_as_full_text IS
    'Mailing address as a single text block.';
COMMENT ON COLUMN applicant.state_code IS
    'Two-letter code of the state of residence.';
COMMENT ON COLUMN applicant.postcode IS
    'ZIP code.';
COMMENT ON COLUMN applicant.identification_type IS
    'Identification presented: driver license, state ID, passport, federal employer identification number, or other.';
COMMENT ON COLUMN applicant.identification_number IS
    'Identification number as shown on the document presented.';
