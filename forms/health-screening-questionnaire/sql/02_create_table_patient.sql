-- Patient: the person being screened, and their emergency contact.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'prefer-not-to-say', '')),
    identifier_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (identifier_type IN ('nhs-number', 'employee-number', 'other', '')),
    identifier_value VARCHAR(50) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    emergency_contact_name VARCHAR(255) NOT NULL DEFAULT '',
    emergency_contact_relationship VARCHAR(100) NOT NULL DEFAULT '',
    emergency_contact_phone VARCHAR(50) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient, i.e. the person being screened.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.name IS
    'Name.';
COMMENT ON COLUMN patient.birth_date IS
    'Birth date, such as for calculating age and for the paediatric safety flag.';
COMMENT ON COLUMN patient.sex IS
    'Sex, such as for the sex-adjusted AUDIT-C at-risk threshold.';
COMMENT ON COLUMN patient.identifier_type IS
    'Which identifier scheme identifier_value belongs to: an NHS number, an employer-issued employee number, or another scheme.';
COMMENT ON COLUMN patient.identifier_value IS
    'The identifier value itself, in the scheme named by identifier_type.';
COMMENT ON COLUMN patient.email IS
    'Email address.';
COMMENT ON COLUMN patient.phone IS
    'Phone number.';
COMMENT ON COLUMN patient.emergency_contact_name IS
    'Name of the emergency contact.';
COMMENT ON COLUMN patient.emergency_contact_relationship IS
    'Relationship of the emergency contact to the patient.';
COMMENT ON COLUMN patient.emergency_contact_phone IS
    'Phone number of the emergency contact.';

CREATE INDEX patient_index_gto
    ON patient
    USING GIN ((
        name
    ) gin_trgm_ops);
