-- Clinician who conducts the hernia diagnostic evaluation.

CREATE TABLE hernia_diagnostic_evaluation.clinician (
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
    role VARCHAR(30) NOT NULL DEFAULT '' CHECK (role IN ('general-practitioner', 'surgical-registrar', 'general-surgeon', 'nurse-practitioner', 'other', '')),
    registration_body VARCHAR(10) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'other', '')),
    registration_number VARCHAR(50) NOT NULL DEFAULT '',
    employer TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON hernia_diagnostic_evaluation.clinician
    FOR EACH ROW
    EXECUTE FUNCTION hernia_diagnostic_evaluation.set_updated_at();

COMMENT ON TABLE hernia_diagnostic_evaluation.clinician IS
    'Clinician, i.e. the GP, surgical registrar, or general surgeon who conducts the hernia diagnostic evaluation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.name IS
    'Name.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.email IS
    'Email address.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.role IS
    'Clinician role, i.e. the job role the practitioner holds when performing the evaluation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.registration_body IS
    'Professional registration body, such as GMC for a registered doctor in the United Kingdom.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.registration_number IS
    'Professional registration number issued by the registration body.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician.employer IS
    'Employer, such as the NHS trust, health board, or general practice.';

CREATE INDEX clinician_index_gto
    ON hernia_diagnostic_evaluation.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
