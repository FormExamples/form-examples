-- The liable person applying for the Council Tax discount: name, birth date
-- and contact details.

CREATE TABLE united_kingdom_council_tax_discount_application.applicant (
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
    BEFORE UPDATE ON united_kingdom_council_tax_discount_application.applicant
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_council_tax_discount_application.set_updated_at();

COMMENT ON TABLE united_kingdom_council_tax_discount_application.applicant IS
    'The liable person applying for the Council Tax discount: name, birth date and contact details.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.name IS
    'Full name of the applicant (the liable person).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.applicant.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';

CREATE INDEX applicant_name_trgm_idx
    ON united_kingdom_council_tax_discount_application.applicant
    USING GIN (name gin_trgm_ops);
