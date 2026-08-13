-- Dietitian employee information provided by the employer.

CREATE TABLE dietitian (
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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('dietitian', 'specialist-dietitian', 'dietetic-assistant', 'assistant-practitioner', 'dietetic-student', 'nutrition-nurse', 'nutritionist', 'other', '')),
    specialty TEXT NOT NULL DEFAULT '' CHECK (specialty IN ('general', 'acute', 'community', 'oncology', 'renal', 'diabetes', 'gastroenterology', 'paediatrics', 'critical-care', 'home-enteral-feeding', 'bariatric', 'eating-disorders', 'inherited-metabolic', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('HCPC', 'NMC', 'GMC', 'AfN', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    employer TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_dietitian_updated_at
    BEFORE UPDATE ON dietitian
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dietitian IS
    'Dietitian, i.e. the registered practitioner who conducts the dietetic assessment.';
COMMENT ON COLUMN dietitian.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dietitian.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN dietitian.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dietitian.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dietitian.name IS
    'Name.';
COMMENT ON COLUMN dietitian.email IS
    'Email address.';
COMMENT ON COLUMN dietitian.phone IS
    'Phone number.';
COMMENT ON COLUMN dietitian.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN dietitian.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN dietitian.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN dietitian.role IS
    'Dietitian role, i.e. the job role the practitioner holds.';
COMMENT ON COLUMN dietitian.specialty IS
    'Dietetic specialty, i.e. the clinical area the practitioner works in.';
COMMENT ON COLUMN dietitian.registration_body IS
    'Professional registration body, such as HCPC for a registered dietitian in the United Kingdom.';
COMMENT ON COLUMN dietitian.registration_number IS
    'Professional registration number issued by the registration body.';
COMMENT ON COLUMN dietitian.employer IS
    'Employer, such as the NHS trust, health board, or private practice.';
COMMENT ON COLUMN dietitian.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX dietitian_index_gto
    ON dietitian
    USING GIN ((
        name
    ) gin_trgm_ops);
