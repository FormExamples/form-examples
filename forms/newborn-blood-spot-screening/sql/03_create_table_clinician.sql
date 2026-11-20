-- Clinician information used to identify the sample-taker who took and
-- recorded the newborn blood spot (heel-prick) sample (midwife, health
-- visitor, neonatal nurse, laboratory, or other trained sample-taker).

CREATE TABLE newborn_blood_spot_screening.clinician (
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
    role VARCHAR(20) NOT NULL DEFAULT '' CHECK (role IN ('midwife', 'health-visitor', 'neonatal-nurse', 'laboratory', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON newborn_blood_spot_screening.clinician
    FOR EACH ROW
    EXECUTE FUNCTION newborn_blood_spot_screening.set_updated_at();

COMMENT ON TABLE newborn_blood_spot_screening.clinician IS
    'Clinician identifying information for the sample-taker who took and recorded the newborn blood spot sample.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.name IS
    'Sample-taker full name.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.email IS
    'Email address.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.role IS
    'Sample-taker role: midwife, health-visitor, neonatal-nurse, laboratory, or other.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON newborn_blood_spot_screening.clinician
    USING GIN (name gin_trgm_ops);
