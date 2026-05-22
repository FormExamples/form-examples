-- Employer information for the Return to Work form.

CREATE TABLE employer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    industry_sector VARCHAR(100) NOT NULL DEFAULT '' CHECK (industry_sector IN (
        'agriculture', 'construction', 'education', 'energy-utilities',
        'finance-insurance', 'food-hospitality', 'government', 'healthcare',
        'information-technology', 'manufacturing', 'mining', 'professional-services',
        'public-safety-emergency', 'retail', 'transport-logistics', 'aviation',
        'rail', 'maritime', 'media', 'other', '')),
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    occupational_health_contact_name TEXT NOT NULL DEFAULT '',
    occupational_health_contact_email TEXT NOT NULL DEFAULT '',
    occupational_health_contact_phone TEXT NOT NULL DEFAULT '',
    hr_contact_name TEXT NOT NULL DEFAULT '',
    hr_contact_email TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_employer_updated_at
    BEFORE UPDATE ON employer
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE employer IS
    'Employer of the patient. Recipient of the Statement of Fitness for Work.';
COMMENT ON COLUMN employer.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN employer.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN employer.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN employer.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN employer.name IS
    'Registered employer name.';
COMMENT ON COLUMN employer.industry_sector IS
    'Industry sector for risk-assessment and RIDDOR context.';
COMMENT ON COLUMN employer.postal_address_as_full_text IS
    'Employer postal address as full text.';
COMMENT ON COLUMN employer.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format.';
COMMENT ON COLUMN employer.postcode IS
    'Postal code.';
COMMENT ON COLUMN employer.occupational_health_contact_name IS
    'Name of the employer occupational-health contact.';
COMMENT ON COLUMN employer.occupational_health_contact_email IS
    'Email of the employer occupational-health contact.';
COMMENT ON COLUMN employer.occupational_health_contact_phone IS
    'Phone of the employer occupational-health contact.';
COMMENT ON COLUMN employer.hr_contact_name IS
    'Name of the employer HR contact.';
COMMENT ON COLUMN employer.hr_contact_email IS
    'Email of the employer HR contact.';

CREATE INDEX employer_index_gto
    ON employer
    USING GIN ((
        name
    ) gin_trgm_ops);
