-- Patient demographic information

CREATE TABLE eye_prescription.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (sex IN ('male', 'female', 'other', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON eye_prescription.patient
    FOR EACH ROW
    EXECUTE FUNCTION eye_prescription.set_updated_at();

COMMENT ON TABLE eye_prescription.patient IS
    'Patient demographic record.';
COMMENT ON COLUMN eye_prescription.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription.patient.name IS
    'Patient full name as presented for the sight test.';
COMMENT ON COLUMN eye_prescription.patient.birth_date IS
    'Patient date of birth (used to compute paediatric flag and default expiry).';
COMMENT ON COLUMN eye_prescription.patient.sex IS
    'Patient sex: male, female, other, unknown.';
COMMENT ON COLUMN eye_prescription.patient.email IS
    'Email address.';
COMMENT ON COLUMN eye_prescription.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN eye_prescription.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN eye_prescription.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format (e.g. GB).';
COMMENT ON COLUMN eye_prescription.patient.postcode IS
    'Postal code.';
COMMENT ON COLUMN eye_prescription.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number (10 digits with check digit).';
