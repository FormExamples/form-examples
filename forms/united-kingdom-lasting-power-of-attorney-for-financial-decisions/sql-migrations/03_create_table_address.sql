--liquibase formatted sql

--changeset author:1
-- Address — every postal address used by an LPA, normalised so that
-- attorneys living at the donor's address share one row.

CREATE TABLE address (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    address_line_1 TEXT NOT NULL DEFAULT '',
    address_line_2 TEXT NOT NULL DEFAULT '',
    address_line_3 TEXT NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 TEXT NOT NULL DEFAULT 'GB'
);
--rollback DROP TABLE address;

--changeset author:2
CREATE TRIGGER trigger_address_updated_at
    BEFORE UPDATE ON address
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_address_updated_at ON address;

--changeset author:3
ALTER TABLE person
    ADD CONSTRAINT person_address_id_fkey
    FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE SET NULL;
--rollback ALTER TABLE person DROP CONSTRAINT IF EXISTS person_address_id_fkey;

--changeset author:4
COMMENT ON TABLE address IS
    'Address — postal address used by an LPA, normalised across persons and roles.';
COMMENT ON COLUMN address.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN address.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN address.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN address.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN address.address_line_1 IS
    'First line of the postal address, typically house number or name and street.';
COMMENT ON COLUMN address.address_line_2 IS
    'Second line of the postal address, typically locality or village.';
COMMENT ON COLUMN address.address_line_3 IS
    'Third line of the postal address, typically town or city.';
COMMENT ON COLUMN address.postcode IS
    'Postal code (UK postcode for GB addresses).';
COMMENT ON COLUMN address.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 code; defaults to GB because LP1F is a UK instrument.';
--rollback SELECT 1;
