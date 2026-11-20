-- Clinician information for the registrar or staff member who handles
-- this United Kingdom Birth Registration.

CREATE TABLE united_kingdom_birth_registration.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('registrar', 'deputy-registrar', 'superintendent-registrar', 'gro-caseworker', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GRO', 'local-authority', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON united_kingdom_birth_registration.clinician
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_birth_registration.set_updated_at();

COMMENT ON TABLE united_kingdom_birth_registration.clinician IS
    'Clinician information for the registrar or staff member handling the United Kingdom Birth Registration.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.name IS
    'Full name of the registrar or staff member.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.role IS
    'Role of the staff member: registrar, deputy-registrar, superintendent-registrar, gro-caseworker, or other.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.registration_body IS
    'Registration body: GRO, local-authority, or other.';
COMMENT ON COLUMN united_kingdom_birth_registration.clinician.registration_number IS
    'Staff or registrar reference number.';

CREATE INDEX clinician_name_trgm_idx
    ON united_kingdom_birth_registration.clinician
    USING GIN (name gin_trgm_ops);
