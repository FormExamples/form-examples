-- Clinician issuing the Return to Work statement.

CREATE TABLE return_to_work.clinician (
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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('gp', 'occupational-health-physician', 'hospital-consultant', 'specialty-registrar', 'nurse', 'pharmacist', 'physiotherapist', 'occupational-therapist', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'GOC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    practice_ods_code VARCHAR(10) NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON return_to_work.clinician
    FOR EACH ROW
    EXECUTE FUNCTION return_to_work.set_updated_at();

COMMENT ON TABLE return_to_work.clinician IS
    'Clinician issuing the Return to Work statement (GP, OH physician, hospital doctor, registered nurse, pharmacist, physiotherapist, or occupational therapist authorised under the UK fit-note scheme).';
COMMENT ON COLUMN return_to_work.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN return_to_work.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN return_to_work.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN return_to_work.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN return_to_work.clinician.name IS
    'Full name of the clinician.';
COMMENT ON COLUMN return_to_work.clinician.email IS
    'Email address.';
COMMENT ON COLUMN return_to_work.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN return_to_work.clinician.postal_address_as_full_text IS
    'Practice or clinic postal address.';
COMMENT ON COLUMN return_to_work.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format.';
COMMENT ON COLUMN return_to_work.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN return_to_work.clinician.role IS
    'Clinician role: gp, occupational-health-physician, hospital-consultant, specialty-registrar, nurse, pharmacist, physiotherapist, occupational-therapist, or other.';
COMMENT ON COLUMN return_to_work.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, GOC, or other.';
COMMENT ON COLUMN return_to_work.clinician.registration_number IS
    'Professional registration number from the registration body.';
COMMENT ON COLUMN return_to_work.clinician.site_name IS
    'Name of the clinic, practice, or hospital where the assessment was performed.';
COMMENT ON COLUMN return_to_work.clinician.practice_ods_code IS
    'NHS ODS code for the issuing practice or organisation.';
COMMENT ON COLUMN return_to_work.clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number of the clinician (where they are also a patient on the same system).';

CREATE INDEX clinician_index_gto
    ON return_to_work.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
