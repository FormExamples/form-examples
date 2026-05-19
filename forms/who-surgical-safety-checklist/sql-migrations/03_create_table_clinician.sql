-- Clinician (operating-team member) who can sign off a checklist phase.

CREATE TABLE clinician (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ( 'surgeon', 'assistant-surgeon', 'anaesthetist', 'circulating-nurse', 'scrub-nurse', 'anaesthetic-assistant', 'perfusionist', 'technician', 'other', '' )),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    employee_number TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON clinician
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE clinician IS
    'Operating-room clinician who can fill in or sign off the WHO Surgical Safety Checklist.';
COMMENT ON COLUMN clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN clinician.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN clinician.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN clinician.deleted_at IS
    'Timestamp when this row was deleted (soft delete).';
COMMENT ON COLUMN clinician.name IS
    'Clinician full name.';
COMMENT ON COLUMN clinician.email IS
    'Work email address.';
COMMENT ON COLUMN clinician.phone IS
    'Work phone number.';
COMMENT ON COLUMN clinician.role IS
    'Operating-room role. One of: surgeon, assistant-surgeon, anaesthetist, circulating-nurse, scrub-nurse, anaesthetic-assistant, perfusionist, technician, other.';
COMMENT ON COLUMN clinician.registration_body IS
    'Professional registration body. One of: GMC, NMC, HCPC, GPhC, other.';
COMMENT ON COLUMN clinician.registration_number IS
    'Registration number issued by the registration body.';
COMMENT ON COLUMN clinician.employee_number IS
    'Local employee or smart-card number at the operating facility.';
COMMENT ON COLUMN clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX clinician_index_gto
    ON clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
