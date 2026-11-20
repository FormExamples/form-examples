-- Clinician employee information used to identify the assessing
-- clinician (doctor, nurse-practitioner, paramedic, physiotherapist).

CREATE TABLE ottawa_ankle_rules.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('doctor', 'nurse-practitioner', 'paramedic', 'physiotherapist', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON ottawa_ankle_rules.clinician
    FOR EACH ROW
    EXECUTE FUNCTION ottawa_ankle_rules.set_updated_at();

COMMENT ON TABLE ottawa_ankle_rules.clinician IS
    'Clinician identifying information for the assessing clinician.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.email IS
    'Email address.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.role IS
    'Primary clinical role: doctor, nurse-practitioner, paramedic, physiotherapist, or other.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN ottawa_ankle_rules.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON ottawa_ankle_rules.clinician
    USING GIN (name gin_trgm_ops);
