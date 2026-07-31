-- Clinician employee information used to identify the author of an
-- inpatient clinical note, the responsible consultant, and any named
-- senior reviewer.

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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('foundation-doctor', 'core-trainee', 'specialty-registrar', 'consultant', 'acp', 'physician-associate', 'nurse', 'nurse-practitioner', 'pharmacist', 'allied-health-professional', 'other', '')),
    grade VARCHAR(20) NOT NULL DEFAULT '' CHECK (grade IN ('FY1', 'FY2', 'CT1', 'CT2', 'CT3', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8', 'SAS', 'consultant', 'other', '')),
    specialty VARCHAR(60) NOT NULL DEFAULT '',
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Clinician identifying information for the author of an inpatient clinical note, the responsible consultant, and any named senior reviewer.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN clinician.name IS
    'Clinician full name as recorded on the note.';
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
    'Professional role: foundation-doctor, core-trainee, specialty-registrar, consultant, acp (advanced clinical practitioner), physician-associate, nurse, nurse-practitioner, pharmacist, allied-health-professional, or other.';
COMMENT ON COLUMN clinician.grade IS
    'Training or employment grade: FY1, FY2, CT1..CT3, ST1..ST8, SAS, consultant, or other.';
COMMENT ON COLUMN clinician.specialty IS
    'Clinical specialty the clinician works in.';
COMMENT ON COLUMN clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON clinician
    USING GIN (name gin_trgm_ops);
