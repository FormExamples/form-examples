-- Main United States vehicle title and registration application record: one
-- application for a certificate of title and registration with a state motor
-- vehicle agency. It captures the application (state, transaction,
-- acquisition), the owner identification, the vehicle and VIN, the federal
-- odometer disclosure, the title history and brands, any lien, insurance and
-- inspections, and the fees and tax. The classification result, the audit trail
-- of fired rules, and the flagged issues live in dedicated child tables. This
-- record is documentation support, not legal advice; the issuing state agency
-- decides.

CREATE TABLE united_states_vehicle_title_and_registration_application.vehicle_title_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    applicant_id UUID NOT NULL REFERENCES united_states_vehicle_title_and_registration_application.applicant(id) ON DELETE RESTRICT,
    lienholder_id UUID REFERENCES united_states_vehicle_title_and_registration_application.lienholder(id) ON DELETE RESTRICT,
    state VARCHAR(2) NOT NULL DEFAULT '',
    transaction_type VARCHAR(22) NOT NULL DEFAULT '' CHECK (transaction_type IN ('title-and-registration', 'title-only', 'registration-only', '')),
    vehicle_condition VARCHAR(4) NOT NULL DEFAULT '' CHECK (vehicle_condition IN ('new', 'used', '')),
    acquisition_method VARCHAR(16) NOT NULL DEFAULT '' CHECK (acquisition_method IN ('dealer-purchase', 'private-purchase', 'gift', 'inheritance', 'other', '')),
    out_of_state_transfer VARCHAR(5) NOT NULL DEFAULT '' CHECK (out_of_state_transfer IN ('yes', 'no', '')),
    previous_state VARCHAR(2) NOT NULL DEFAULT '',
    acquisition_date DATE,
    application_date DATE,
    owner_name TEXT NOT NULL DEFAULT '',
    co_owner_name TEXT NOT NULL DEFAULT '',
    co_owner_conjunction VARCHAR(3) NOT NULL DEFAULT '' CHECK (co_owner_conjunction IN ('and', 'or', '')),
    owner_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (owner_type IN ('individual', 'business', '')),
    identification_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (identification_type IN ('drivers-license', 'state-id', 'passport', 'fein', 'other', '')),
    identification_number TEXT NOT NULL DEFAULT '',
    mailing_address TEXT NOT NULL DEFAULT '',
    owner_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (owner_signed IN ('yes', 'no', '')),
    co_owner_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (co_owner_signed IN ('yes', 'no', '')),
    vin VARCHAR(40) NOT NULL DEFAULT '',
    model_year INTEGER,
    make TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT '',
    body_type TEXT NOT NULL DEFAULT '',
    vehicle_class VARCHAR(11) NOT NULL DEFAULT '' CHECK (vehicle_class IN ('passenger', 'light-truck', 'heavy-truck', 'motorcycle', 'trailer', 'motorhome', '')),
    fuel_type VARCHAR(8) NOT NULL DEFAULT '' CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'other', '')),
    gvwr_lbs INTEGER,
    color TEXT NOT NULL DEFAULT '',
    odometer_reading INTEGER,
    odometer_status VARCHAR(25) NOT NULL DEFAULT '' CHECK (odometer_status IN ('actual', 'exceeds-mechanical-limits', 'not-actual', '')),
    seller_odometer_statement VARCHAR(5) NOT NULL DEFAULT '' CHECK (seller_odometer_statement IN ('yes', 'no', '')),
    buyer_odometer_acknowledged VARCHAR(5) NOT NULL DEFAULT '' CHECK (buyer_odometer_acknowledged IN ('yes', 'no', '')),
    title_document VARCHAR(32) NOT NULL DEFAULT '' CHECK (title_document IN ('state-title', 'manufacturer-statement-of-origin', 'out-of-state-title', 'none', '')),
    prior_title_surrendered VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_title_surrendered IN ('yes', 'no', '')),
    title_brand VARCHAR(19) NOT NULL DEFAULT '' CHECK (title_brand IN ('none', 'salvage', 'junk', 'rebuilt', 'flood', 'odometer-not-actual', 'lemon-law-buyback', 'hail', 'other', '')),
    brand_disclosed VARCHAR(5) NOT NULL DEFAULT '' CHECK (brand_disclosed IN ('yes', 'no', '')),
    nmvtis_check VARCHAR(20) NOT NULL DEFAULT '' CHECK (nmvtis_check IN ('clear', 'brand-or-theft-found', 'not-checked', '')),
    brand_inspection VARCHAR(14) NOT NULL DEFAULT '' CHECK (brand_inspection IN ('passed', 'not-done', 'not-applicable', '')),
    lien_status VARCHAR(24) NOT NULL DEFAULT '' CHECK (lien_status IN ('none', 'new-lien', 'existing-lien-released', 'existing-lien-unreleased', '')),
    lienholder_name TEXT NOT NULL DEFAULT '',
    lien_electronic VARCHAR(5) NOT NULL DEFAULT '' CHECK (lien_electronic IN ('yes', 'no', '')),
    insurance_proof VARCHAR(12) NOT NULL DEFAULT '' CHECK (insurance_proof IN ('provided', 'not-provided', '')),
    insurance_expiry_date DATE,
    emissions_inspection VARCHAR(12) NOT NULL DEFAULT '' CHECK (emissions_inspection IN ('passed', 'not-done', 'exempt', 'not-required', '')),
    safety_inspection VARCHAR(12) NOT NULL DEFAULT '' CHECK (safety_inspection IN ('passed', 'not-done', 'exempt', 'not-required', '')),
    vin_verification VARCHAR(12) NOT NULL DEFAULT '' CHECK (vin_verification IN ('done', 'not-done', 'not-required', '')),
    purchase_price_usd NUMERIC(12,2),
    sales_tax_status VARCHAR(14) NOT NULL DEFAULT '' CHECK (sales_tax_status IN ('paid-to-dealer', 'due-at-title', 'exempt', 'not-calculated', '')),
    sales_tax_rate_percent NUMERIC(6,3),
    sales_tax_amount_usd NUMERIC(12,2),
    tax_exemption_reason TEXT NOT NULL DEFAULT '',
    title_fee_usd NUMERIC(8,2),
    registration_fee_usd NUMERIC(8,2),
    fees_tendered VARCHAR(5) NOT NULL DEFAULT '' CHECK (fees_tendered IN ('yes', 'no', '')),
    applicant_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX vehicle_title_application_applicant_id_idx
    ON united_states_vehicle_title_and_registration_application.vehicle_title_application (applicant_id);
CREATE INDEX vehicle_title_application_lienholder_id_idx
    ON united_states_vehicle_title_and_registration_application.vehicle_title_application (lienholder_id);

CREATE TRIGGER trigger_vehicle_title_application_updated_at
    BEFORE UPDATE ON united_states_vehicle_title_and_registration_application.vehicle_title_application
    FOR EACH ROW
    EXECUTE FUNCTION united_states_vehicle_title_and_registration_application.set_updated_at();

COMMENT ON TABLE united_states_vehicle_title_and_registration_application.vehicle_title_application IS
    'A United States vehicle title and registration application: the application, owner, vehicle, odometer disclosure, title history and brands, lien, insurance and inspections, and fees and tax.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.applicant_id IS
    'Foreign key to the owner (applicant).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.lienholder_id IS
    'Foreign key to the lienholder; null when there is no lien.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.state IS
    'Two-letter code of the state that will issue the title.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.transaction_type IS
    'Transaction type: title and registration, title only, or registration only.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.vehicle_condition IS
    'Whether the vehicle is new (never titled) or used.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.acquisition_method IS
    'How the vehicle was acquired.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.out_of_state_transfer IS
    'Whether the vehicle was last titled in another state (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.previous_state IS
    'Two-letter code of the state that last titled the vehicle.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.acquisition_date IS
    'Date of sale, gift, or inheritance; most states set a deadline from this date.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.application_date IS
    'Date of the application.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.owner_name IS
    'Owner full legal name as entered on the application.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.co_owner_name IS
    'Co-owner full legal name, if any.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.co_owner_conjunction IS
    'AND (both owners must sign to sell) or OR (either may sign) between the owners.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.owner_type IS
    'Owner type: individual or business.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.identification_type IS
    'Identification type presented by the owner.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.identification_number IS
    'Identification number presented by the owner.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.mailing_address IS
    'Owner mailing address as a single text block.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.owner_signed IS
    'Whether the owner has signed the application (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.co_owner_signed IS
    'Whether the co-owner has signed the application (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.vin IS
    'Vehicle identification number as entered; validated against 49 CFR 565.15.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.model_year IS
    'Model year of the vehicle.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.make IS
    'Vehicle make.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.model IS
    'Vehicle model.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.body_type IS
    'Vehicle body type, e.g. 4-door sedan.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.vehicle_class IS
    'Vehicle class: passenger car, light truck or SUV, heavy truck, motorcycle, trailer, or motorhome.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.fuel_type IS
    'Fuel type; electric and hybrid vehicles are treated differently for emissions and some fees.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.gvwr_lbs IS
    'Gross vehicle weight rating in pounds; over 16,000 exempts the odometer disclosure.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.color IS
    'Vehicle color.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.odometer_reading IS
    'Odometer reading in whole miles.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.odometer_status IS
    'Odometer status: actual mileage, exceeds mechanical limits, or not the actual mileage.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.seller_odometer_statement IS
    'Whether the seller signed the odometer disclosure statement (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.buyer_odometer_acknowledged IS
    'Whether the buyer acknowledged the odometer disclosure (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.title_document IS
    'Title document held: state title, manufacturer''s statement of origin, out-of-state title, or none.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.prior_title_surrendered IS
    'Whether the prior title is surrendered with the application (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.title_brand IS
    'Title brand: none, salvage, junk, rebuilt, flood, odometer not actual, lemon-law buyback, hail, or other.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.brand_disclosed IS
    'Whether the brand is disclosed on the application and to the buyer (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.nmvtis_check IS
    'Result of the National Motor Vehicle Title Information System check.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.brand_inspection IS
    'Rebuilt-vehicle inspection status.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.lien_status IS
    'Lien status: none, new lien, existing lien released, or existing lien not released.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.lienholder_name IS
    'Lienholder name as entered on the application.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.lien_electronic IS
    'Whether the lien is held electronically (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.insurance_proof IS
    'Whether proof of insurance is provided.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.insurance_expiry_date IS
    'Insurance policy expiry date.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.emissions_inspection IS
    'Emissions (smog) inspection status.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.safety_inspection IS
    'Safety inspection status.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.vin_verification IS
    'Out-of-state VIN verification status.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.purchase_price_usd IS
    'Purchase price in US dollars.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.sales_tax_status IS
    'Sales or use tax status: paid to the dealer, due at titling, exempt, or not yet calculated.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.sales_tax_rate_percent IS
    'Sales or use tax rate entered, in percent.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.sales_tax_amount_usd IS
    'Sales or use tax amount in US dollars.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.tax_exemption_reason IS
    'Statutory basis for a tax exemption.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.title_fee_usd IS
    'Title fee in US dollars.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.registration_fee_usd IS
    'Registration fee in US dollars.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.fees_tendered IS
    'Whether the title and registration fees are tendered with the application (yes/no).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.vehicle_title_application.applicant_note IS
    'Free-text note from the applicant to the clerk.';
