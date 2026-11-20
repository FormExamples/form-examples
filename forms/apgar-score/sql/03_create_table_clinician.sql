-- Clinician information used to identify the professional attending the
-- birth and recording the Apgar assessment (midwife, obstetrician,
-- neonatologist, neonatal nurse, paediatrician).

CREATE TABLE apgar_score.clinician (
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
    role VARCHAR(20) NOT NULL DEFAULT '' CHECK (role IN ('midwife', 'obstetrician', 'neonatologist', 'neonatal-nurse', 'paediatrician', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON apgar_score.clinician
    FOR EACH ROW
    EXECUTE FUNCTION apgar_score.set_updated_at();

COMMENT ON TABLE apgar_score.clinician IS
    'Clinician identifying information for the professional attending the birth and recording the Apgar assessment.';
COMMENT ON COLUMN apgar_score.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN apgar_score.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN apgar_score.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN apgar_score.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN apgar_score.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN apgar_score.clinician.email IS
    'Email address.';
COMMENT ON COLUMN apgar_score.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN apgar_score.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN apgar_score.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN apgar_score.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN apgar_score.clinician.role IS
    'Primary clinical role: midwife, obstetrician, neonatologist, neonatal-nurse, paediatrician, or other.';
COMMENT ON COLUMN apgar_score.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN apgar_score.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON apgar_score.clinician
    USING GIN (name gin_trgm_ops);
