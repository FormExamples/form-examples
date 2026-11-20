-- Clinician employee information used to identify the clinician who
-- recorded the NEWS2 observation set and (for Scale 2) endorsed the
-- prescribed SpO2 target range.

CREATE TABLE national_early_warning_score_2.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('consultant', 'registrar', 'foundation-trainee', 'staff-nurse', 'charge-nurse', 'nursing-associate', 'healthcare-assistant', 'ward-coordinator', 'medical-student', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON national_early_warning_score_2.clinician
    FOR EACH ROW
    EXECUTE FUNCTION national_early_warning_score_2.set_updated_at();

COMMENT ON TABLE national_early_warning_score_2.clinician IS
    'Clinician identifying information for the person who recorded the NEWS2 observation set.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.email IS
    'Email address.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.role IS
    'Primary clinical role: consultant, registrar, foundation-trainee, staff-nurse, charge-nurse, nursing-associate, healthcare-assistant, ward-coordinator, medical-student, or other.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN national_early_warning_score_2.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON national_early_warning_score_2.clinician
    USING GIN (name gin_trgm_ops);
