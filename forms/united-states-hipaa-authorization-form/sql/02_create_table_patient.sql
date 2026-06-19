-- Patient identification fields for the HIPAA authorization form.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE,
    social_security_number VARCHAR(11) NOT NULL DEFAULT '',
    street_address TEXT NOT NULL DEFAULT '',
    city VARCHAR(120) NOT NULL DEFAULT '',
    state VARCHAR(2) NOT NULL DEFAULT '',
    zip_code VARCHAR(10) NOT NULL DEFAULT '',
    phone VARCHAR(30) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient identification fields for the HIPAA authorization form.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when this row was deleted (soft-delete).';
COMMENT ON COLUMN patient.name IS
    'Patient print name, as it appears on the signed authorization.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth. Required by 45 CFR § 164.508(c)(1)(vi) for identity-binding the signature.';
COMMENT ON COLUMN patient.social_security_number IS
    'Social Security Number, optional. State templates such as TN HS-2557 mark this as "not required". Format NNN-NN-NNNN.';
COMMENT ON COLUMN patient.street_address IS
    'Street address line.';
COMMENT ON COLUMN patient.city IS
    'City.';
COMMENT ON COLUMN patient.state IS
    'US state two-letter abbreviation (e.g. TN, PA, CA).';
COMMENT ON COLUMN patient.zip_code IS
    'US ZIP code (5 or 9 digit).';
COMMENT ON COLUMN patient.phone IS
    'Phone number including area code.';
COMMENT ON COLUMN patient.email IS
    'Email address, optional.';
