-- Main United States vehicle bill of sale record: one private-party sale of a
-- motor vehicle. It captures the sale transaction (state, date, price, payment,
-- sales-tax basis), the seller and buyer, the vehicle (year, make, model, body
-- type, VIN, title brand), the federal odometer disclosure statement required by
-- 49 CFR Part 580, the as-is clause, title and lien status, any required
-- notarization, and the post-sale release of liability and buyer title
-- application. The completeness classification, the audit trail of fired rules,
-- and the flagged issues live in dedicated child tables. This record supports
-- documentation; it is not legal advice, and the issuing state agency decides.

CREATE TABLE united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    seller_id UUID NOT NULL REFERENCES united_states_vehicle_bill_of_sale.seller(id) ON DELETE RESTRICT,
    buyer_id UUID REFERENCES united_states_vehicle_bill_of_sale.buyer(id) ON DELETE RESTRICT,


    -- Sale transaction
    state VARCHAR(2) NOT NULL DEFAULT '',
    sale_date DATE,
    sale_price_as_usd NUMERIC(12,2),
    payment_method VARCHAR(10) NOT NULL DEFAULT '' CHECK (payment_method IN ('cash', 'check', 'wire', 'financing', 'trade', 'gift', '')),
    tax_basis VARCHAR(30) NOT NULL DEFAULT '' CHECK (tax_basis IN ('purchase-price', 'standard-presumptive-value', 'fair-market-value', 'exempt-gift', 'exempt-family', '')),

    -- Seller (transferor)
    seller_name TEXT NOT NULL DEFAULT '',
    seller_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (seller_type IN ('individual', 'business', '')),
    seller_street_address TEXT NOT NULL DEFAULT '',
    seller_city TEXT NOT NULL DEFAULT '',
    seller_state VARCHAR(2) NOT NULL DEFAULT '',
    seller_postal_code VARCHAR(10) NOT NULL DEFAULT '',
    seller_phone VARCHAR(30) NOT NULL DEFAULT '',
    seller_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (seller_signed IN ('yes', 'no', '')),

    -- Buyer (transferee)
    buyer_name TEXT NOT NULL DEFAULT '',
    buyer_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (buyer_type IN ('individual', 'business', '')),
    buyer_street_address TEXT NOT NULL DEFAULT '',
    buyer_city TEXT NOT NULL DEFAULT '',
    buyer_state VARCHAR(2) NOT NULL DEFAULT '',
    buyer_postal_code VARCHAR(10) NOT NULL DEFAULT '',
    buyer_phone VARCHAR(30) NOT NULL DEFAULT '',
    buyer_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (buyer_signed IN ('yes', 'no', '')),

    -- Vehicle
    vehicle_year INTEGER,
    vehicle_make VARCHAR(60) NOT NULL DEFAULT '',
    vehicle_model VARCHAR(60) NOT NULL DEFAULT '',
    body_type VARCHAR(40) NOT NULL DEFAULT '',
    vin VARCHAR(25) NOT NULL DEFAULT '',
    vehicle_color VARCHAR(40) NOT NULL DEFAULT '',
    title_number VARCHAR(40) NOT NULL DEFAULT '',
    title_brand VARCHAR(10) NOT NULL DEFAULT '' CHECK (title_brand IN ('clean', 'salvage', 'rebuilt', 'flood', 'lemon', 'junk', 'unknown', '')),
    gvwr_over_16000 VARCHAR(5) NOT NULL DEFAULT '' CHECK (gvwr_over_16000 IN ('yes', 'no', '')),
    self_propelled VARCHAR(5) NOT NULL DEFAULT '' CHECK (self_propelled IN ('yes', 'no', '')),

    -- Odometer disclosure (49 CFR 580)
    odometer_reading_miles INTEGER,
    odometer_status VARCHAR(30) NOT NULL DEFAULT '' CHECK (odometer_status IN ('actual', 'exceeds-mechanical-limits', 'not-actual', '')),
    odometer_seller_certified VARCHAR(5) NOT NULL DEFAULT '' CHECK (odometer_seller_certified IN ('yes', 'no', '')),
    odometer_buyer_acknowledged VARCHAR(5) NOT NULL DEFAULT '' CHECK (odometer_buyer_acknowledged IN ('yes', 'no', '')),

    -- Terms, title, and lien
    seller_holds_title VARCHAR(5) NOT NULL DEFAULT '' CHECK (seller_holds_title IN ('yes', 'no', '')),
    title_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (title_signed IN ('yes', 'no', '')),
    lien_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (lien_status IN ('none', 'released', 'outstanding', '')),
    lienholder_name TEXT NOT NULL DEFAULT '',
    lien_release_date DATE,
    as_is_clause VARCHAR(10) NOT NULL DEFAULT '' CHECK (as_is_clause IN ('as-is', 'warranty', '')),
    warranty_note TEXT NOT NULL DEFAULT '',
    notarized VARCHAR(20) NOT NULL DEFAULT '' CHECK (notarized IN ('yes', 'no', 'not-required', '')),

    -- After the sale
    release_of_liability_filed VARCHAR(5) NOT NULL DEFAULT '' CHECK (release_of_liability_filed IN ('yes', 'no', '')),
    release_filed_date DATE,
    plates_removed VARCHAR(5) NOT NULL DEFAULT '' CHECK (plates_removed IN ('yes', 'no', '')),
    buyer_title_application_date DATE
);

CREATE INDEX united_states_vehicle_bill_of_sale_seller_id_idx
    ON united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale (seller_id);
CREATE INDEX united_states_vehicle_bill_of_sale_buyer_id_idx
    ON united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale (buyer_id);
CREATE INDEX united_states_vehicle_bill_of_sale_vin_idx
    ON united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale (vin);

CREATE TRIGGER trigger_united_states_vehicle_bill_of_sale_updated_at
    BEFORE UPDATE ON united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale
    FOR EACH ROW
    EXECUTE FUNCTION united_states_vehicle_bill_of_sale.set_updated_at();

COMMENT ON TABLE united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale IS
    'Main United States vehicle bill of sale record: sale transaction, seller, buyer, vehicle, the federal odometer disclosure (49 CFR 580), as-is clause, title and lien status, notarization, and post-sale release of liability. Completeness classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_id IS
    'Foreign key to the seller (restrict delete).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_id IS
    'Foreign key to the buyer (restrict delete); optional until the buyer is known.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.state IS
    'Two-letter USPS code of the state whose rules govern the sale (the state that will title and register the vehicle); empty when unanswered.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.sale_date IS
    'Date the vehicle changed hands (date of sale and of odometer transfer).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.sale_price_as_usd IS
    'Purchase price in US dollars; 0 for a gift; null when unanswered.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.payment_method IS
    'How the price was paid: cash, check, wire, financing, trade, or gift.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.tax_basis IS
    'Basis on which the buyer will pay sales or use tax: purchase price, state standard presumptive value, fair market value, or a claimed gift or family exemption.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_name IS
    'Seller printed name as it appears on the title.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_type IS
    'Whether the seller is an individual or a business.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_street_address IS
    'Seller current street address (required by 49 CFR 580.5 for the odometer disclosure).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_city IS
    'Seller city.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_state IS
    'Seller two-letter state code.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_postal_code IS
    'Seller ZIP or ZIP+4 code.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_phone IS
    'Seller telephone number.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_signed IS
    'Whether the seller signed the bill of sale.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_name IS
    'Buyer printed name.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_type IS
    'Whether the buyer is an individual or a business.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_street_address IS
    'Buyer current street address (required by 49 CFR 580.5 for the odometer disclosure).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_city IS
    'Buyer city.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_state IS
    'Buyer two-letter state code.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_postal_code IS
    'Buyer ZIP or ZIP+4 code.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_phone IS
    'Buyer telephone number.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_signed IS
    'Whether the buyer signed the bill of sale.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.vehicle_year IS
    'Model year of the vehicle.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.vehicle_make IS
    'Vehicle make.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.vehicle_model IS
    'Vehicle model.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.body_type IS
    'Vehicle body type (required by 49 CFR 580.5).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.vin IS
    'Vehicle Identification Number; 17 characters for a 1981 or newer vehicle.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.vehicle_color IS
    'Vehicle color.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.title_number IS
    'Certificate of title number.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.title_brand IS
    'Brand on the title: clean, salvage, rebuilt, flood, lemon-law buyback, junk, or unknown.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.gvwr_over_16000 IS
    'Whether the gross vehicle weight rating exceeds 16,000 pounds (exempt from the federal odometer rule).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.self_propelled IS
    'Whether the vehicle is self-propelled (a trailer is not, and is exempt from the federal odometer rule).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.odometer_reading_miles IS
    'Odometer reading in whole miles at transfer, without tenths; null when unanswered.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.odometer_status IS
    'Seller certification under 49 CFR 580.5: actual mileage, mileage exceeds the odometer mechanical limits, or the reading is not the actual mileage (warning odometer discrepancy).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.odometer_seller_certified IS
    'Whether the seller signed the odometer disclosure statement.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.odometer_buyer_acknowledged IS
    'Whether the buyer signed the odometer disclosure acknowledgement.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.seller_holds_title IS
    'Whether the seller holds the certificate of title in hand at the sale.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.title_signed IS
    'Whether the seller has signed the title over to the buyer.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.lien_status IS
    'Lien status: none, released (lien release in hand), or outstanding.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.lienholder_name IS
    'Name of the lienholder, if any.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.lien_release_date IS
    'Date the lienholder released the lien.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.as_is_clause IS
    'Warranty terms: sold as is with no warranty, or with a written warranty.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.warranty_note IS
    'Description of any written warranty; empty for an as-is sale.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.notarized IS
    'Whether the bill of sale or title assignment was notarized, or notarization is not required.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.release_of_liability_filed IS
    'Whether the seller filed the release of liability or notice of transfer with the state agency.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.release_filed_date IS
    'Date the seller filed the release of liability.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.plates_removed IS
    'Whether the seller removed the license plates (relevant where plates stay with the seller).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale.united_states_vehicle_bill_of_sale.buyer_title_application_date IS
    'Date the buyer applied to title and register the vehicle.';
