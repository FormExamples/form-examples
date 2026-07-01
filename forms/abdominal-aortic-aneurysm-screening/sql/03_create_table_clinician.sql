-- Clinician information used to identify the screening technician who performed
-- the abdominal aortic ultrasound scan (screening technician, clinical skills
-- trainer, or other trained scanner).

CREATE TABLE clinician (
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
    role VARCHAR(30) NOT NULL DEFAULT '' CHECK (role IN ('screening-technician', 'clinical-skills-trainer', 'vascular', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Clinician identifying information for the screening technician who performed the abdominal aortic ultrasound scan.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Screening technician full name.';
COMMENT ON COLUMN clinician.email IS
    'Email address.';
COMMENT ON COLUMN clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN clinician.role IS
    'Scanner role: screening-technician, clinical-skills-trainer, vascular, or other.';
COMMENT ON COLUMN clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON clinician
    USING GIN (name gin_trgm_ops);
