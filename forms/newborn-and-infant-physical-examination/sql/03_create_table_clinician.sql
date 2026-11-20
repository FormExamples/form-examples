-- Clinician information used to identify the practitioner who performed
-- the NIPE screening examination (midwife, neonatal nurse, paediatrician,
-- GP, or nurse practitioner).

CREATE TABLE newborn_and_infant_physical_examination.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('midwife', 'neonatal-nurse', 'paediatrician', 'gp', 'nurse-practitioner', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON newborn_and_infant_physical_examination.clinician
    FOR EACH ROW
    EXECUTE FUNCTION newborn_and_infant_physical_examination.set_updated_at();

COMMENT ON TABLE newborn_and_infant_physical_examination.clinician IS
    'Clinician identifying information for the practitioner who performed the NIPE screening examination.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.name IS
    'Practitioner full name as recorded in the rota.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.email IS
    'Email address.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.role IS
    'Examining practitioner role: midwife, neonatal-nurse, paediatrician, gp, nurse-practitioner, or other.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON newborn_and_infant_physical_examination.clinician
    USING GIN (name gin_trgm_ops);
