-- Clinician employee information used to identify members of the
-- operating team (surgeon, assistant, anaesthetist, ODP, scrub nurse,
-- circulating nurse).

CREATE TABLE medical_operation_note.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('consultant-surgeon', 'surgical-registrar', 'foundation-trainee', 'consultant-anaesthetist', 'anaesthetic-registrar', 'odp', 'scrub-nurse', 'circulating-nurse', 'theatre-coordinator', 'medical-student', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON medical_operation_note.clinician
    FOR EACH ROW
    EXECUTE FUNCTION medical_operation_note.set_updated_at();

COMMENT ON TABLE medical_operation_note.clinician IS
    'Clinician identifying information for members of the operating team.';
COMMENT ON COLUMN medical_operation_note.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_operation_note.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_operation_note.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_operation_note.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN medical_operation_note.clinician.email IS
    'Email address.';
COMMENT ON COLUMN medical_operation_note.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN medical_operation_note.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN medical_operation_note.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN medical_operation_note.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN medical_operation_note.clinician.role IS
    'Primary clinical role: consultant-surgeon, surgical-registrar, foundation-trainee, consultant-anaesthetist, anaesthetic-registrar, odp, scrub-nurse, circulating-nurse, theatre-coordinator, medical-student, or other.';
COMMENT ON COLUMN medical_operation_note.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN medical_operation_note.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON medical_operation_note.clinician
    USING GIN (name gin_trgm_ops);
