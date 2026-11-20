-- Clinician employee information used to identify the assessing
-- clinician (emergency physician, acute physician, cardiologist, nurse).

CREATE TABLE grace_score_for_acute_coronary_syndrome.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('emergency-physician', 'acute-physician', 'cardiologist', 'nurse', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON grace_score_for_acute_coronary_syndrome.clinician
    FOR EACH ROW
    EXECUTE FUNCTION grace_score_for_acute_coronary_syndrome.set_updated_at();

COMMENT ON TABLE grace_score_for_acute_coronary_syndrome.clinician IS
    'Clinician identifying information for the assessing clinician.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.name IS
    'Clinician full name.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.email IS
    'Email address.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.role IS
    'Primary clinical role: emergency-physician, acute-physician, cardiologist, nurse, or other.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN grace_score_for_acute_coronary_syndrome.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON grace_score_for_acute_coronary_syndrome.clinician
    USING GIN (name gin_trgm_ops);
