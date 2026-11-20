-- Registered keeper of the vehicle: the person or organization responsible
-- for registering and taxing it, who may differ from the applicant and the owner.

CREATE TABLE united_kingdom_vehicle_registration_application.keeper (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    keeper_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (keeper_type IN ('individual', 'company', 'organization', 'trade', 'other', '')),
    company_registration_number VARCHAR(20) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT
);

CREATE TRIGGER trigger_keeper_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_registration_application.keeper
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_vehicle_registration_application.set_updated_at();

COMMENT ON TABLE united_kingdom_vehicle_registration_application.keeper IS
    'Registered keeper of the vehicle: the person or organization responsible for registering and taxing it, who may differ from the applicant and the owner.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.name IS
    'Registered keeper full name, or the organization name for a company keeper.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.keeper_type IS
    'Kind of keeper: individual, company, organization, trade, or other.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.company_registration_number IS
    'Companies House registration number for a company keeper, else empty.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.keeper.postcode IS
    'Postal code.';

CREATE INDEX keeper_name_trgm_idx
    ON united_kingdom_vehicle_registration_application.keeper
    USING GIN (name gin_trgm_ops);
