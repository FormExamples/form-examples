-- The medical practice (GP surgery, hospital department, occupational-health
-- service, pharmacy, etc.) responsible for the fit note. DWP policy 3.7
-- requires the practice address to appear on the form.

CREATE TABLE medical_practice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    postal_address_as_full_text TEXT NOT NULL DEFAULT '',
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    phone TEXT,
    email TEXT,
    ods_code TEXT,
    setting TEXT NOT NULL DEFAULT '' CHECK (setting IN (
        'primary_care',
        'secondary_care_inpatient',
        'secondary_care_discharge',
        'occupational_health',
        'pharmacy',
        'community_clinic',
        'private_practice',
        'other',
        ''
    ))
);

CREATE TRIGGER trigger_medical_practice_updated_at
    BEFORE UPDATE ON medical_practice
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_practice IS
    'The medical practice that owns the fit note (mandatory per DWP policy 3.7).';
COMMENT ON COLUMN medical_practice.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_practice.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_practice.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_practice.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_practice.name IS
    'Practice or organisation name as printed on the fit note.';
COMMENT ON COLUMN medical_practice.postal_address_as_full_text IS
    'Practice postal address.';
COMMENT ON COLUMN medical_practice.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 (typically GB).';
COMMENT ON COLUMN medical_practice.postcode IS
    'Practice postcode.';
COMMENT ON COLUMN medical_practice.phone IS
    'Practice phone number.';
COMMENT ON COLUMN medical_practice.email IS
    'Practice email address.';
COMMENT ON COLUMN medical_practice.ods_code IS
    'NHS Organisation Data Service (ODS) code identifying the practice.';
COMMENT ON COLUMN medical_practice.setting IS
    'Care setting: primary_care, secondary_care_inpatient, secondary_care_discharge, occupational_health, pharmacy, community_clinic, or private_practice.';

CREATE INDEX medical_practice_index_gto
    ON medical_practice
    USING GIN ((
        name
    ) gin_trgm_ops);
