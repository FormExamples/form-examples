-- Practitioner (clinician) who signs the FP92A.
--
-- Per NHSBSA rules, the FP92A must be completed and signed by a doctor or
-- health professional with access to the patient's medical records. The
-- practitioner attests to the qualifying condition(s) listed on the form.

CREATE TABLE practitioner (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('gp', 'hospital-doctor', 'nurse-practitioner', 'pharmacist-prescriber', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    practice_name VARCHAR(255) NOT NULL DEFAULT '',
    practice_code VARCHAR(20) NOT NULL DEFAULT '',
    practitioner_code VARCHAR(20) NOT NULL DEFAULT '',
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_practitioner_updated_at
    BEFORE UPDATE ON practitioner
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE practitioner IS
    'Practitioner who signs the FP92A and attests to the qualifying condition(s).';
COMMENT ON COLUMN practitioner.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN practitioner.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN practitioner.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN practitioner.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN practitioner.name IS
    'Practitioner full name.';
COMMENT ON COLUMN practitioner.email IS
    'Optional practitioner email.';
COMMENT ON COLUMN practitioner.phone IS
    'Practice telephone number printed on the FP92A.';
COMMENT ON COLUMN practitioner.role IS
    'Practitioner role / job title.';
COMMENT ON COLUMN practitioner.registration_body IS
    'Professional registration body (GMC for doctors, NMC for nurses, HCPC, GPhC).';
COMMENT ON COLUMN practitioner.registration_number IS
    'Professional registration number issued by the registration body.';
COMMENT ON COLUMN practitioner.practice_name IS
    'GP surgery / practice / clinic name printed on the FP92A.';
COMMENT ON COLUMN practitioner.practice_code IS
    'NHS practice code (where applicable).';
COMMENT ON COLUMN practitioner.practitioner_code IS
    'NHS practitioner code (where applicable).';
COMMENT ON COLUMN practitioner.postal_address_as_full_text IS
    'Practice postal address as printed on the FP92A.';
COMMENT ON COLUMN practitioner.country_as_iso_3166_1_alpha_2 IS
    'Practice country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN practitioner.postcode IS
    'Practice postcode.';
COMMENT ON COLUMN practitioner.united_kingdom_nhs_number IS
    'Optional NHS staff number for the practitioner.';

CREATE INDEX practitioner_index_gto
    ON practitioner
    USING GIN ((
        name
    ) gin_trgm_ops);
