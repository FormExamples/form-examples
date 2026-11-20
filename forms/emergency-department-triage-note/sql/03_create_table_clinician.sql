-- Clinician information used to identify the triaging clinician
-- (triage nurse, emergency nurse practitioner, emergency physician,
-- registrar, healthcare assistant, or paramedic).

CREATE TABLE emergency_department_triage_note.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('triage-nurse', 'emergency-nurse-practitioner', 'emergency-physician', 'emergency-registrar', 'foundation-trainee', 'healthcare-assistant', 'paramedic', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON emergency_department_triage_note.clinician
    FOR EACH ROW
    EXECUTE FUNCTION emergency_department_triage_note.set_updated_at();

COMMENT ON TABLE emergency_department_triage_note.clinician IS
    'Clinician identifying information for the triaging clinician.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.email IS
    'Email address.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.role IS
    'Primary clinical role: triage-nurse, emergency-nurse-practitioner, emergency-physician, emergency-registrar, foundation-trainee, healthcare-assistant, paramedic, or other.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN emergency_department_triage_note.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON emergency_department_triage_note.clinician
    USING GIN (name gin_trgm_ops);
