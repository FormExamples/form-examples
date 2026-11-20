-- Seller (transferor): the party to the sale who transfers the vehicle and signs the odometer disclosure.
-- The per-sale copy of the party details lives on the main bill of sale
-- record; this table holds the reusable contact record.

CREATE TABLE united_states_vehicle_bill_of_sale.seller (
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
    BEFORE UPDATE ON united_states_vehicle_bill_of_sale.seller
    FOR EACH ROW
    EXECUTE FUNCTION united_states_vehicle_bill_of_sale.set_updated_at();

CREATE INDEX seller_name_trgm_idx
    ON united_states_vehicle_bill_of_sale.seller
    USING GIN (name gin_trgm_ops);

COMMENT ON TABLE united_states_vehicle_bill_of_sale.seller IS
    'Seller (transferor) contact record for a United States vehicle bill of sale: name, contact details, ZIP code, and whether an individual or a business.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.name IS
    'Full printed name of the seller as it appears on the certificate of title.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.email IS
    'Email address.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.phone IS
    'Telephone number.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.postal_address_as_full_text IS
    'Full postal address as free text.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.country_as_iso_3166_1_alpha_2 IS
    'Country as an ISO 3166-1 alpha-2 code.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.postcode IS
    'ZIP or ZIP+4 code.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.seller.party_type IS
    'Whether the party is an individual or a business.';
