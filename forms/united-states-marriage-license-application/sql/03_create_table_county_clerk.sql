-- The county clerk, recorder, or registrar office that issues the marriage
-- license and records the certified marriage certificate.

CREATE TABLE county_clerk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL DEFAULT '',
    county TEXT NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    website TEXT
);

CREATE TRIGGER trigger_county_clerk_updated_at
    BEFORE UPDATE ON county_clerk
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE county_clerk IS
    'The county clerk, recorder, or registrar office that issues the marriage license and records the certificate.';
COMMENT ON COLUMN county_clerk.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN county_clerk.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN county_clerk.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN county_clerk.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN county_clerk.name IS
    'Name of the county clerk or recorder office that issues marriage licenses.';
COMMENT ON COLUMN county_clerk.state IS
    'Two-letter USPS code of the state the office serves.';
COMMENT ON COLUMN county_clerk.county IS
    'County the office serves.';
COMMENT ON COLUMN county_clerk.email IS
    'Email address.';
COMMENT ON COLUMN county_clerk.phone IS
    'Phone number.';
COMMENT ON COLUMN county_clerk.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN county_clerk.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN county_clerk.postcode IS
    'ZIP or postal code.';
COMMENT ON COLUMN county_clerk.website IS
    'Website with the office fee schedule and appointment rules.';

CREATE INDEX county_clerk_name_trgm_idx
    ON county_clerk
    USING GIN (name gin_trgm_ops);
