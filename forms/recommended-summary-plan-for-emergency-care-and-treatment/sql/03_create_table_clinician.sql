-- Clinician information used to identify the clinician who completed and
-- signed the ReSPECT plan and any senior clinician who endorsed it.

CREATE TABLE recommended_summary_plan_for_emergency_care_and_treatment.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('doctor', 'nurse', 'paramedic', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON recommended_summary_plan_for_emergency_care_and_treatment.clinician
    FOR EACH ROW
    EXECUTE FUNCTION recommended_summary_plan_for_emergency_care_and_treatment.set_updated_at();

COMMENT ON TABLE recommended_summary_plan_for_emergency_care_and_treatment.clinician IS
    'Clinician identifying information for the clinician who completed and signed the ReSPECT plan and any senior clinician who endorsed it.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.name IS
    'Clinician full name as recorded on the plan.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.email IS
    'Email address.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.role IS
    'Primary clinical role: doctor, nurse, paramedic, or other.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, or other.';
COMMENT ON COLUMN recommended_summary_plan_for_emergency_care_and_treatment.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON recommended_summary_plan_for_emergency_care_and_treatment.clinician
    USING GIN (name gin_trgm_ops);
