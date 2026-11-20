-- Reporting clinician (endoscopist) information.

CREATE TABLE colonoscopy_test_result.clinician (
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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('gastroenterologist', 'colorectal-surgeon', 'nurse-endoscopist', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT '',
    united_kingdom_nhs_number CHAR(12) UNIQUE
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON colonoscopy_test_result.clinician
    FOR EACH ROW
    EXECUTE FUNCTION colonoscopy_test_result.set_updated_at();

COMMENT ON TABLE colonoscopy_test_result.clinician IS
    'Reporting clinician (endoscopist) who performs, authors, and signs the colonoscopy result report.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.name IS
    'Name.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.email IS
    'Email address.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.role IS
    'Reporting clinician (endoscopist) role: gastroenterologist, colorectal-surgeon, nurse-endoscopist, other.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.registration_body IS
    'Clinician registration body: GMC, NMC, HCPC, other.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.registration_number IS
    'Clinician registration number.';
COMMENT ON COLUMN colonoscopy_test_result.clinician.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';

CREATE INDEX clinician_index_gto
    ON colonoscopy_test_result.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
