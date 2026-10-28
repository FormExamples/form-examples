-- Manufacturer (or authorized representative) of the medical device.

CREATE TABLE manufacturer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    single_registration_number TEXT NOT NULL DEFAULT '',
    authorized_representative_name TEXT NOT NULL DEFAULT '',
    united_kingdom_responsible_person_name TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_manufacturer_updated_at
    BEFORE UPDATE ON manufacturer
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX manufacturer_index_gto
    ON manufacturer
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON TABLE manufacturer IS
    'Manufacturer.';
COMMENT ON COLUMN manufacturer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN manufacturer.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN manufacturer.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN manufacturer.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN manufacturer.name IS
    'Name.';
COMMENT ON COLUMN manufacturer.email IS
    'Email.';
COMMENT ON COLUMN manufacturer.phone IS
    'Phone.';
COMMENT ON COLUMN manufacturer.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN manufacturer.country_as_iso_3166_1_alpha_2 IS
    'Country as iso 3166 1 alpha 2.';
COMMENT ON COLUMN manufacturer.postcode IS
    'Postcode.';
COMMENT ON COLUMN manufacturer.single_registration_number IS
    'Single registration number.';
COMMENT ON COLUMN manufacturer.authorized_representative_name IS
    'Authorized representative name.';
COMMENT ON COLUMN manufacturer.united_kingdom_responsible_person_name IS
    'United kingdom responsible person name.';
