-- Clinician employee information used to identify the assessing
-- clinician (intensivist, critical-care physician, acute-medicine
-- physician, resident, nurse, or outreach practitioner).

CREATE TABLE sequential_organ_failure_assessment.clinician (
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
    role VARCHAR(40) NOT NULL DEFAULT '' CHECK (role IN ('intensivist', 'critical-care-physician', 'acute-physician', 'resident', 'nurse', 'outreach-practitioner', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON sequential_organ_failure_assessment.clinician
    FOR EACH ROW
    EXECUTE FUNCTION sequential_organ_failure_assessment.set_updated_at();

COMMENT ON TABLE sequential_organ_failure_assessment.clinician IS
    'Clinician identifying information for the assessing clinician.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.name IS
    'Clinician full name.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.email IS
    'Email address.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.role IS
    'Primary clinical role: intensivist, critical-care-physician, acute-physician, resident, nurse, outreach-practitioner, or other.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON sequential_organ_failure_assessment.clinician
    USING GIN (name gin_trgm_ops);
