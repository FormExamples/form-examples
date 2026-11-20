-- Main vehicle registration application record: one DVLA application to
-- register a vehicle in Great Britain, either a V62 request for a V5C
-- registration certificate, a V55/4 or V55/5 first registration, an imported
-- vehicle, or a V627/1 rebuilt or kit vehicle. It captures the keeper and
-- owner, the vehicle identity, the supporting evidence (type approval, MOT,
-- insurance, NOVA, build evidence), the fee, and the declaration. The
-- completeness and validity classification, the audit trail of fired rules,
-- and the flagged issues live in dedicated child tables.

CREATE TABLE united_kingdom_vehicle_registration_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    -- Foreign keys
    applicant_id UUID NOT NULL REFERENCES applicant(id) ON DELETE RESTRICT,
    keeper_id UUID REFERENCES keeper(id) ON DELETE RESTRICT,
    -- Application
    application_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (application_type IN ('v62-replacement-v5c', 'v62-acquired-without-v5c', 'v55-4-new-vehicle', 'v55-5-used-vehicle', 'imported-vehicle', 'v627-1-rebuilt-or-kit', '')),
    application_date DATE,
    v5c_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (v5c_status IN ('lost', 'stolen', 'destroyed', 'not-received', 'damaged', 'never-had', 'has-v5c', '')),
    weeks_since_change_of_keeper INTEGER,
    new_keeper_slip_provided VARCHAR(5) NOT NULL DEFAULT '' CHECK (new_keeper_slip_provided IN ('yes', 'no', '')),
    -- Keeper and owner
    owner_differs_from_keeper VARCHAR(5) NOT NULL DEFAULT '' CHECK (owner_differs_from_keeper IN ('yes', 'no', '')),
    owner_name TEXT NOT NULL DEFAULT '',
    keeper_address_in_northern_ireland VARCHAR(5) NOT NULL DEFAULT '' CHECK (keeper_address_in_northern_ireland IN ('yes', 'no', '')),
    -- Vehicle
    registration_number VARCHAR(12) NOT NULL DEFAULT '',
    vehicle_identification_number VARCHAR(30) NOT NULL DEFAULT '',
    engine_number VARCHAR(30) NOT NULL DEFAULT '',
    make TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT '',
    colour TEXT NOT NULL DEFAULT '',
    vehicle_category VARCHAR(20) NOT NULL DEFAULT '' CHECK (vehicle_category IN ('car', 'motorcycle', 'light-goods', 'heavy-goods', 'bus', 'other', '')),
    fuel_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'lpg', 'other', '')),
    engine_capacity_as_cc INTEGER,
    date_of_manufacture DATE,
    date_first_used DATE,
    seriously_damaged VARCHAR(5) NOT NULL DEFAULT '' CHECK (seriously_damaged IN ('yes', 'no', '')),
    -- Approval, newness, MOT and insurance
    certificate_of_newness_provided VARCHAR(5) NOT NULL DEFAULT '' CHECK (certificate_of_newness_provided IN ('yes', 'no', '')),
    type_approval VARCHAR(25) NOT NULL DEFAULT '' CHECK (type_approval IN ('ecwvta', 'gb-type-approval', 'ni-type-approval', 'iva', 'msva', 'exempt-over-10-years', 'none', '')),
    mot_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (mot_status IN ('valid', 'not-required', 'missing', '')),
    insurance_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (insurance_status IN ('in-force', 'none', '')),
    -- Import
    country_of_export TEXT NOT NULL DEFAULT '',
    import_date DATE,
    nova_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (nova_status IN ('notified', 'not-notified', 'not-applicable', '')),
    nova_reference VARCHAR(40) NOT NULL DEFAULT '',
    -- Rebuilt or kit vehicle
    build_evidence_provided VARCHAR(5) NOT NULL DEFAULT '' CHECK (build_evidence_provided IN ('yes', 'no', '')),
    donor_vehicle_count INTEGER,
    -- Fee
    fee_payment_method VARCHAR(20) NOT NULL DEFAULT '' CHECK (fee_payment_method IN ('cheque', 'postal-order', 'post-office-card', 'online-card', 'none', '')),
    fee_paid_as_pence INTEGER,
    -- Declaration
    declaration_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (declaration_signed IN ('yes', 'no', '')),
    declaration_date DATE,
    applicant_note TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_united_kingdom_vehicle_registration_application_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_registration_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX united_kingdom_vehicle_registration_application_applicant_id_idx
    ON united_kingdom_vehicle_registration_application (applicant_id);
CREATE INDEX united_kingdom_vehicle_registration_application_keeper_id_idx
    ON united_kingdom_vehicle_registration_application (keeper_id);

COMMENT ON TABLE united_kingdom_vehicle_registration_application IS
    'Main vehicle registration application record: V62 replacement V5C, V55/4 or V55/5 first registration, imported vehicle, or V627/1 rebuilt or kit vehicle, with keeper, vehicle identity, supporting evidence, fee, and declaration.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant_id IS
    'Foreign key to the applicant.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper_id IS
    'Foreign key to the registered keeper when different from the applicant.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.application_type IS
    'Application variant: v62-replacement-v5c, v62-acquired-without-v5c, v55-4-new-vehicle, v55-5-used-vehicle, imported-vehicle, or v627-1-rebuilt-or-kit.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.application_date IS
    'Date the application was completed.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.v5c_status IS
    'Why a V5C is needed: lost, stolen, destroyed, not-received, damaged, never-had (acquired without one), or has-v5c.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.weeks_since_change_of_keeper IS
    'Whole weeks since the keeper change, used for the 6-week not-received replacement window.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.new_keeper_slip_provided IS
    'Whether the green new-keeper slip from the most recent V5C is enclosed (yes/no); it waives the V62 fee.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.owner_differs_from_keeper IS
    'Whether the legal owner differs from the registered keeper (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.owner_name IS
    'Name of the owner when the owner differs from the keeper.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper_address_in_northern_ireland IS
    'Whether the keeper address is in Northern Ireland (yes/no); insurance and a 4-year MOT threshold apply.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.registration_number IS
    'Vehicle registration mark (number plate), blank for a first registration where the DVLA assigns one.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.vehicle_identification_number IS
    'Vehicle identification number (VIN, chassis number).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.engine_number IS
    'Engine number as stamped on the engine.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.make IS
    'Vehicle make (manufacturer).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.model IS
    'Vehicle model.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.colour IS
    'Vehicle colour.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.vehicle_category IS
    'Vehicle category: car, motorcycle, light-goods, heavy-goods, bus, or other.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.fuel_type IS
    'Fuel type: petrol, diesel, electric, hybrid, lpg, or other.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.engine_capacity_as_cc IS
    'Engine capacity in cubic centimetres, null for electric vehicles.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.date_of_manufacture IS
    'Date the vehicle was manufactured.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.date_first_used IS
    'Date the vehicle was first used, anywhere.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.seriously_damaged IS
    'Whether the vehicle is seriously damaged and cannot be repaired (yes/no); such a vehicle cannot be registered.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.certificate_of_newness_provided IS
    'Whether a certificate of newness (or declaration for imports) is enclosed (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.type_approval IS
    'Type approval evidence: ecwvta, gb-type-approval, ni-type-approval, iva, msva, exempt-over-10-years, or none.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.mot_status IS
    'MOT evidence: valid, not-required, or missing.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.insurance_status IS
    'Insurance evidence: in-force or none.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.country_of_export IS
    'Country the vehicle was imported from.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.import_date IS
    'Date the vehicle arrived in Great Britain.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.nova_status IS
    'HMRC Notification of Vehicle Arrivals (NOVA) status: notified, not-notified, or not-applicable.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.nova_reference IS
    'NOVA reference given by HMRC.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.build_evidence_provided IS
    'Whether receipts and build evidence for a rebuilt or kit vehicle are enclosed (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.donor_vehicle_count IS
    'Number of donor vehicles whose parts were used, for a rebuilt vehicle.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.fee_payment_method IS
    'Payment method for the fee: cheque, postal-order, post-office-card, online-card, or none.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.fee_paid_as_pence IS
    'Fee enclosed or paid, in pence.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.declaration_signed IS
    'Whether the applicant signed the declaration (yes/no).';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.declaration_date IS
    'Date the declaration was signed.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant_note IS
    'Free-text note from the applicant.';
