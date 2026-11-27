-- Requesting clinician and sample collector information.

CREATE TABLE medical_human_leukocyte_and_disease_association_request.clinician (
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
    role VARCHAR(30) NOT NULL DEFAULT '' CHECK (role IN ('consultant', 'general-practitioner', 'rheumatologist', 'gastroenterologist', 'neurologist', 'ophthalmologist', 'infectious-disease-physician', 'pharmacist', 'nurse', 'phlebotomist', 'other', '')),
    registration_body TEXT NOT NULL DEFAULT '',
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mhldar_clinician_updated_at
    BEFORE UPDATE ON medical_human_leukocyte_and_disease_association_request.clinician
    FOR EACH ROW
    EXECUTE FUNCTION medical_human_leukocyte_and_disease_association_request.set_updated_at();

COMMENT ON TABLE medical_human_leukocyte_and_disease_association_request.clinician IS
    'Clinician who requests the tests (and, where different, collects the samples).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.name IS
    'Name.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.email IS
    'Email address.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.postcode IS
    'Postal code, such as for validating the postal address.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.role IS
    'Clinician role: consultant, general-practitioner, rheumatologist, gastroenterologist, neurologist, ophthalmologist, infectious-disease-physician, pharmacist, nurse, phlebotomist, other.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.registration_body IS
    'Professional registration body, as free text (varies by jurisdiction).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.clinician.registration_number IS
    'Professional registration number.';

CREATE INDEX clinician_index_gto
    ON medical_human_leukocyte_and_disease_association_request.clinician
    USING GIN ((
        name
    ) gin_trgm_ops);
