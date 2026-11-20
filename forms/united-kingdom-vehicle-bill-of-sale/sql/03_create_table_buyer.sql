-- The buyer of the vehicle: contact details of the person buying.

CREATE TABLE buyer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    postcode TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2)
);

CREATE INDEX buyer_name_trgm_idx
    ON buyer
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_buyer_updated_at
    BEFORE UPDATE ON buyer
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE buyer IS
    'The buyer of the vehicle: contact details of the person buying.';
COMMENT ON COLUMN buyer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN buyer.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN buyer.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN buyer.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN buyer.name IS
    'Full name of the buyer.';
COMMENT ON COLUMN buyer.email IS
    'Email address.';
COMMENT ON COLUMN buyer.phone IS
    'Phone number.';
COMMENT ON COLUMN buyer.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN buyer.postcode IS
    'Postal code.';
COMMENT ON COLUMN buyer.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
