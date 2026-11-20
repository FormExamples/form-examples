-- The seller of the vehicle: contact details of the person or trader selling.

CREATE TABLE united_kingdom_vehicle_bill_of_sale.seller (
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

CREATE INDEX seller_name_trgm_idx
    ON united_kingdom_vehicle_bill_of_sale.seller
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_seller_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_bill_of_sale.seller
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_vehicle_bill_of_sale.set_updated_at();

COMMENT ON TABLE united_kingdom_vehicle_bill_of_sale.seller IS
    'The seller of the vehicle: contact details of the person or trader selling.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.name IS
    'Full name of the seller.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.seller.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
