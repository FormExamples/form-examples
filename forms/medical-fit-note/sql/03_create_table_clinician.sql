-- Clinician who assesses the employee and signs the fit note.

CREATE TABLE clinician (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('gp', 'hospital-doctor', 'nurse', 'occupational-therapist', 'pharmacist', 'physiotherapist', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    practice_name TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX clinician_index_gto
    ON clinician
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON TABLE clinician IS
    'Clinician.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN clinician.name IS
    'Name.';
COMMENT ON COLUMN clinician.email IS
    'Email.';
COMMENT ON COLUMN clinician.phone IS
    'Phone.';
COMMENT ON COLUMN clinician.role IS
    'Role. One of: gp, hospital-doctor, nurse, occupational-therapist, pharmacist, physiotherapist, other.';
COMMENT ON COLUMN clinician.registration_body IS
    'Registration body. One of: GMC, NMC, HCPC, GPhC, other.';
COMMENT ON COLUMN clinician.registration_number IS
    'Registration number.';
COMMENT ON COLUMN clinician.practice_name IS
    'Practice name.';
