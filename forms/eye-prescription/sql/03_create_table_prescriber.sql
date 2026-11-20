-- Prescriber (GOC-registered optometrist or dispensing optician)

CREATE TABLE eye_prescription.prescriber (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    goc_registration_number VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (role IN (
            'optometrist',
            'dispensing-optician',
            'ophthalmologist',
            'student',
            ''
        )),
    practice_name TEXT NOT NULL DEFAULT '',
    practice_address TEXT NOT NULL DEFAULT '',
    postcode TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    email TEXT,
    phone TEXT
);

CREATE TRIGGER trigger_prescriber_updated_at
    BEFORE UPDATE ON eye_prescription.prescriber
    FOR EACH ROW
    EXECUTE FUNCTION eye_prescription.set_updated_at();

COMMENT ON TABLE eye_prescription.prescriber IS
    'GOC-registered prescriber who issued the spectacle prescription.';
COMMENT ON COLUMN eye_prescription.prescriber.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription.prescriber.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription.prescriber.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription.prescriber.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription.prescriber.name IS
    'Prescriber full name (including title, e.g. "Ms Jane Smith").';
COMMENT ON COLUMN eye_prescription.prescriber.goc_registration_number IS
    'General Optical Council registration number (mandatory).';
COMMENT ON COLUMN eye_prescription.prescriber.role IS
    'Prescriber role: optometrist, dispensing-optician, ophthalmologist, student.';
COMMENT ON COLUMN eye_prescription.prescriber.practice_name IS
    'Name of the practice where the prescription was issued.';
COMMENT ON COLUMN eye_prescription.prescriber.practice_address IS
    'Practice address as full text.';
COMMENT ON COLUMN eye_prescription.prescriber.postcode IS
    'Practice postcode.';
COMMENT ON COLUMN eye_prescription.prescriber.country_as_iso_3166_1_alpha_2 IS
    'Practice country as ISO 3166-1 alpha-2 (e.g. GB).';
COMMENT ON COLUMN eye_prescription.prescriber.email IS
    'Practice contact email.';
COMMENT ON COLUMN eye_prescription.prescriber.phone IS
    'Practice contact phone.';
