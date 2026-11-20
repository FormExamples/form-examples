-- Clinician employee information used to identify the anaesthetic team
-- (consultant anaesthetist, anaesthetic registrar, ODP / anaesthetic
-- assistant, operating surgeon, recovery practitioner).

CREATE TABLE anaesthetic_record.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('consultant-anaesthetist', 'anaesthetic-registrar', 'anaesthetic-sho', 'anaesthesia-associate', 'odp', 'anaesthetic-nurse', 'recovery-practitioner', 'operating-surgeon', 'medical-student', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON anaesthetic_record.clinician
    FOR EACH ROW
    EXECUTE FUNCTION anaesthetic_record.set_updated_at();

COMMENT ON TABLE anaesthetic_record.clinician IS
    'Clinician identifying information for members of the anaesthetic team.';
COMMENT ON COLUMN anaesthetic_record.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN anaesthetic_record.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN anaesthetic_record.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN anaesthetic_record.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN anaesthetic_record.clinician.email IS
    'Email address.';
COMMENT ON COLUMN anaesthetic_record.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN anaesthetic_record.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN anaesthetic_record.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN anaesthetic_record.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN anaesthetic_record.clinician.role IS
    'Primary clinical role: consultant-anaesthetist, anaesthetic-registrar, anaesthetic-sho, anaesthesia-associate, odp, anaesthetic-nurse, recovery-practitioner, operating-surgeon, medical-student, or other.';
COMMENT ON COLUMN anaesthetic_record.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN anaesthetic_record.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON anaesthetic_record.clinician
    USING GIN (name gin_trgm_ops);
