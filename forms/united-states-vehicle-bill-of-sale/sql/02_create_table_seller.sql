-- Seller (transferor): the party to the sale who transfers the vehicle and signs the odometer disclosure.
-- The per-sale copy of the party details lives on the main bill of sale
-- record; this table holds the reusable contact record.

CREATE TABLE seller (
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
    party_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (party_type IN ('individual', 'business', ''))
);

CREATE TRIGGER trigger_seller_updated_at
    BEFORE UPDATE ON seller
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX seller_name_trgm_idx
    ON seller
    USING GIN (name gin_trgm_ops);

COMMENT ON TABLE seller IS
    'Seller (transferor) contact record for a United States vehicle bill of sale: name, contact details, ZIP code, and whether an individual or a business.';
COMMENT ON COLUMN seller.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN seller.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN seller.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN seller.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN seller.name IS
    'Full printed name of the seller as it appears on the certificate of title.';
COMMENT ON COLUMN seller.email IS
    'Email address.';
COMMENT ON COLUMN seller.phone IS
    'Telephone number.';
COMMENT ON COLUMN seller.postal_address_as_full_text IS
    'Full postal address as free text.';
COMMENT ON COLUMN seller.country_as_iso_3166_1_alpha_2 IS
    'Country as an ISO 3166-1 alpha-2 code.';
COMMENT ON COLUMN seller.postcode IS
    'ZIP or ZIP+4 code.';
COMMENT ON COLUMN seller.party_type IS
    'Whether the party is an individual or a business.';
