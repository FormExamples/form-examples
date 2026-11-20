-- Clinician employee information used to identify the authoring nurse and
-- any other registered professionals contributing to the care plan
-- (registered nurse, nursing associate, student nurse).

CREATE TABLE nursing_care_plan.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('registered-nurse', 'nursing-associate', 'student-nurse', 'ward-manager', 'matron', 'healthcare-assistant', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON nursing_care_plan.clinician
    FOR EACH ROW
    EXECUTE FUNCTION nursing_care_plan.set_updated_at();

COMMENT ON TABLE nursing_care_plan.clinician IS
    'Clinician identifying information for the authoring nurse and contributing professionals.';
COMMENT ON COLUMN nursing_care_plan.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nursing_care_plan.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nursing_care_plan.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nursing_care_plan.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN nursing_care_plan.clinician.email IS
    'Email address.';
COMMENT ON COLUMN nursing_care_plan.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN nursing_care_plan.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN nursing_care_plan.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN nursing_care_plan.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN nursing_care_plan.clinician.role IS
    'Primary clinical role: registered-nurse, nursing-associate, student-nurse, ward-manager, matron, healthcare-assistant, or other.';
COMMENT ON COLUMN nursing_care_plan.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN nursing_care_plan.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON nursing_care_plan.clinician
    USING GIN (name gin_trgm_ops);
