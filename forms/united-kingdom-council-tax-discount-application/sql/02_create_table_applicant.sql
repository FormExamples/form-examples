-- The liable person applying for the Council Tax discount: name, birth date
-- and contact details.

CREATE TABLE applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    postcode TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2)
);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON applicant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE applicant IS
    'The liable person applying for the Council Tax discount: name, birth date and contact details.';
COMMENT ON COLUMN applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN applicant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN applicant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN applicant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN applicant.name IS
    'Full name of the applicant (the liable person).';
COMMENT ON COLUMN applicant.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN applicant.email IS
    'Email address.';
COMMENT ON COLUMN applicant.phone IS
    'Phone number.';
COMMENT ON COLUMN applicant.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN applicant.postcode IS
    'Postal code.';
COMMENT ON COLUMN applicant.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';

CREATE INDEX applicant_name_trgm_idx
    ON applicant
    USING GIN (name gin_trgm_ops);
