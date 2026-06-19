-- Donor: the person creating the Lasting Power of Attorney for Health and Welfare.
-- Mental Capacity Act 2005 s.9: the donor must be ≥ 18 and have capacity at signing.

CREATE TABLE donor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    title VARCHAR(20) NOT NULL DEFAULT '',
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    family_name VARCHAR(255) NOT NULL DEFAULT '',
    other_names_used VARCHAR(500) NOT NULL DEFAULT '',
    birth_date DATE,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2) NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number VARCHAR(20),
    jurisdiction VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (jurisdiction IN ('england', 'wales', '')),
    preferred_language VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (preferred_language IN ('en', 'cy', '')),
    capacity_declared VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (capacity_declared IN ('yes', 'no', '')),
    capacity_declared_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_donor_updated_at
    BEFORE UPDATE ON donor
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE donor IS
    'The person creating the LPA. Must be ≥ 18 with mental capacity at signing per Mental Capacity Act 2005 s.9.';
COMMENT ON COLUMN donor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN donor.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN donor.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN donor.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN donor.title IS
    'Honorific title (Mr, Mrs, Dr, …).';
COMMENT ON COLUMN donor.given_names IS
    'Given names of the donor.';
COMMENT ON COLUMN donor.family_name IS
    'Family name of the donor.';
COMMENT ON COLUMN donor.other_names_used IS
    'Any other names the donor uses (LP1H s.1 requires this be listed).';
COMMENT ON COLUMN donor.birth_date IS
    'Date of birth. Used to verify donor age ≥ 18 at signing (R-MCA-S9-AGE).';
COMMENT ON COLUMN donor.email IS
    'Email address.';
COMMENT ON COLUMN donor.phone IS
    'Phone number.';
COMMENT ON COLUMN donor.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN donor.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 (expected GB for England and Wales).';
COMMENT ON COLUMN donor.postcode IS
    'Postal code.';
COMMENT ON COLUMN donor.united_kingdom_nhs_number IS
    'United Kingdom NHS number, optional but useful for cross-form ADRT check.';
COMMENT ON COLUMN donor.jurisdiction IS
    'Jurisdiction within the UK: england or wales. Scotland and Northern Ireland use different schemes.';
COMMENT ON COLUMN donor.preferred_language IS
    'Preferred language: en (English) or cy (Cymraeg / Welsh).';
COMMENT ON COLUMN donor.capacity_declared IS
    'Whether the donor has declared capacity at the point of signing the LPA.';
COMMENT ON COLUMN donor.capacity_declared_at IS
    'Timestamp at which capacity was declared.';
