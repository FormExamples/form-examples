-- The applicant: the spouse or civil partner who makes the application (or one of
-- two joint applicants) for a divorce or the dissolution of a civil partnership.

CREATE TABLE united_kingdom_divorce_application.applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT
);

CREATE INDEX applicant_name_trgm_idx
    ON united_kingdom_divorce_application.applicant
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON united_kingdom_divorce_application.applicant
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_divorce_application.set_updated_at();

COMMENT ON TABLE united_kingdom_divorce_application.applicant IS
    'The applicant: the spouse or civil partner who makes the application (or one of two joint applicants).';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.name IS
    'Full name of the applicant (the person making the application).';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant.postcode IS
    'Postal code.';
