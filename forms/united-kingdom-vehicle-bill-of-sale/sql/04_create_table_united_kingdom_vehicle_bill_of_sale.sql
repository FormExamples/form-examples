-- Main United Kingdom vehicle bill of sale record: one private vehicle sale
-- (GOV.UK Buy a vehicle / Sell, scrap or transfer a vehicle). It captures the
-- sale, the vehicle, the V5C / MOT / finance checks, price and payment, the
-- condition terms, the V5C/2 new keeper slip and DVLA notification, and the
-- signatures. The completeness classification, the audit trail of fired
-- rules, and the flagged issues live in dedicated child tables. This record is
-- documentation support, not legal advice.

CREATE TABLE united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    seller_id UUID NOT NULL REFERENCES united_kingdom_vehicle_bill_of_sale.seller(id) ON DELETE RESTRICT,
    buyer_id UUID REFERENCES united_kingdom_vehicle_bill_of_sale.buyer(id) ON DELETE RESTRICT,
    sale_date DATE,
    sale_place TEXT NOT NULL DEFAULT '',
    seller_capacity VARCHAR(7) NOT NULL DEFAULT '' CHECK (seller_capacity IN ('private', 'trader', '')),
    seller_is_registered_keeper VARCHAR(3) NOT NULL DEFAULT '' CHECK (seller_is_registered_keeper IN ('yes', 'no', '')),
    vehicle_registration VARCHAR(20) NOT NULL DEFAULT '',
    vehicle_make VARCHAR(50) NOT NULL DEFAULT '',
    vehicle_model VARCHAR(50) NOT NULL DEFAULT '',
    vehicle_colour VARCHAR(30) NOT NULL DEFAULT '',
    vehicle_vin VARCHAR(30) NOT NULL DEFAULT '',
    first_registered_year INTEGER,
    fuel_type VARCHAR(8) NOT NULL DEFAULT '' CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric', 'other', '')),
    mileage INTEGER,
    mileage_accuracy VARCHAR(9) NOT NULL DEFAULT '' CHECK (mileage_accuracy IN ('recorded', 'not-known', '')),
    v5c_present VARCHAR(3) NOT NULL DEFAULT '' CHECK (v5c_present IN ('yes', 'no', '')),
    v5c_details_match VARCHAR(3) NOT NULL DEFAULT '' CHECK (v5c_details_match IN ('yes', 'no', '')),
    mot_status VARCHAR(7) NOT NULL DEFAULT '' CHECK (mot_status IN ('valid', 'expired', 'exempt', 'none', '')),
    mot_expiry_date DATE,
    finance_status VARCHAR(11) NOT NULL DEFAULT '' CHECK (finance_status IN ('none', 'outstanding', 'unchecked', '')),
    finance_check_date DATE,
    price_as_gbp NUMERIC(10,2),
    deposit_as_gbp NUMERIC(10,2),
    payment_method VARCHAR(13) NOT NULL DEFAULT '' CHECK (payment_method IN ('bank-transfer', 'cash', 'cheque', 'card', 'other', '')),
    payment_received VARCHAR(3) NOT NULL DEFAULT '' CHECK (payment_received IN ('yes', 'no', '')),
    sale_terms VARCHAR(14) NOT NULL DEFAULT '' CHECK (sale_terms IN ('sold-as-seen', 'warranty-given', '')),
    known_faults TEXT NOT NULL DEFAULT '',
    description_matches_advert VARCHAR(3) NOT NULL DEFAULT '' CHECK (description_matches_advert IN ('yes', 'no', '')),
    new_keeper_slip_given VARCHAR(3) NOT NULL DEFAULT '' CHECK (new_keeper_slip_given IN ('yes', 'no', '')),
    dvla_notification VARCHAR(7) NOT NULL DEFAULT '' CHECK (dvla_notification IN ('online', 'post', 'not-yet', '')),
    seller_signed VARCHAR(3) NOT NULL DEFAULT '' CHECK (seller_signed IN ('yes', 'no', '')),
    buyer_signed VARCHAR(3) NOT NULL DEFAULT '' CHECK (buyer_signed IN ('yes', 'no', '')),
    signature_date DATE,
    note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX united_kingdom_vehicle_bill_of_sale_seller_id_idx
    ON united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale (seller_id);
CREATE INDEX united_kingdom_vehicle_bill_of_sale_buyer_id_idx
    ON united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale (buyer_id);

CREATE TRIGGER trigger_united_kingdom_vehicle_bill_of_sale_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_vehicle_bill_of_sale.set_updated_at();

COMMENT ON TABLE united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale IS
    'Main bill of sale record for a private UK vehicle sale: sale, vehicle, V5C / MOT / finance checks, price and payment, condition terms, DVLA steps, and signatures. Classification, fired rules, and flags live in child tables. Documentation support, not legal advice.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.seller_id IS
    'Foreign key to the seller (restrict delete).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.buyer_id IS
    'Foreign key to the buyer (restrict delete); optional.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.sale_date IS
    'Date of the sale and handover.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.sale_place IS
    'Where the sale took place.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.seller_capacity IS
    'Whether the seller sells as a private individual or as a trader.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.seller_is_registered_keeper IS
    'Whether the seller is the registered keeper named on the V5C (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.vehicle_registration IS
    'Vehicle registration number (number plate).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.vehicle_make IS
    'Vehicle make.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.vehicle_model IS
    'Vehicle model.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.vehicle_colour IS
    'Vehicle colour.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.vehicle_vin IS
    'Vehicle identification number (VIN, chassis number).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.first_registered_year IS
    'Year the vehicle was first registered.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.fuel_type IS
    'Fuel type: petrol, diesel, hybrid, electric, or other.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.mileage IS
    'Odometer reading in miles at the time of sale.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.mileage_accuracy IS
    'Whether the mileage is a recorded reading or not known.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.v5c_present IS
    'Whether the seller has the V5C registration certificate (log book) (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.v5c_details_match IS
    'Whether the V5C details match the vehicle and the seller (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.mot_status IS
    'MOT status: valid, expired, exempt, or none.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.mot_expiry_date IS
    'MOT expiry date.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.finance_status IS
    'Outstanding finance status: none, outstanding, or unchecked.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.finance_check_date IS
    'Date a vehicle history or finance check was run.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.price_as_gbp IS
    'Agreed price in pounds sterling.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.deposit_as_gbp IS
    'Deposit paid in pounds sterling, if any.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.payment_method IS
    'Payment method: bank-transfer, cash, cheque, card, or other.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.payment_received IS
    'Whether the seller has received cleared funds (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.sale_terms IS
    'Sale terms: sold-as-seen or warranty-given.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.known_faults IS
    'Faults disclosed by the seller.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.description_matches_advert IS
    'Whether the vehicle matches the advert and verbal description (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.new_keeper_slip_given IS
    'Whether the seller gave the buyer the V5C/2 new keeper section (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.dvla_notification IS
    'How the seller told DVLA of the sale: online, post, or not-yet.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.seller_signed IS
    'Whether the seller has signed (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.buyer_signed IS
    'Whether the buyer has signed (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.signature_date IS
    'Date of signing.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale.note IS
    'Free-text note.';
