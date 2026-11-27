-- Transplant recipient (patient) demographics and identifiers.

CREATE TABLE medical_renal_transplant_recipient_request.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    family_name VARCHAR(255) NOT NULL,
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    previous_name VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE NOT NULL,
    sex VARCHAR(10) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    ethnicity VARCHAR(100) NOT NULL DEFAULT '',
    national_health_identifier VARCHAR(40) NOT NULL DEFAULT '',
    medical_record_number VARCHAR(40) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT
);

CREATE TRIGGER trigger_mrtrr_patient_updated_at
    BEFORE UPDATE ON medical_renal_transplant_recipient_request.patient
    FOR EACH ROW
    EXECUTE FUNCTION medical_renal_transplant_recipient_request.set_updated_at();

COMMENT ON TABLE medical_renal_transplant_recipient_request.patient IS
    'Transplant recipient (patient).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.family_name IS
    'Family name (surname).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.given_names IS
    'Given names (forenames).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.previous_name IS
    'Previous name, if any; aids identity matching against historical samples and records.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.birth_date IS
    'Birth date.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.sex IS
    'Sex recorded for the patient: female, male, other, unknown.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.ethnicity IS
    'Self-described ethnicity; relevant to HLA allele-frequency interpretation.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.national_health_identifier IS
    'National health identifier issued by the patient''s health system (for example a national insurance or health-card number), as free text.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.medical_record_number IS
    'Hospital or institution medical record number (hospital number).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.email IS
    'Email address.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format, such as for validating the postal address.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.patient.postcode IS
    'Postal code, such as for validating the postal address.';

CREATE INDEX patient_index_gto
    ON medical_renal_transplant_recipient_request.patient
    USING GIN ((
        family_name || ' ' || given_names
    ) gin_trgm_ops);

CREATE INDEX patient_index_national_health_identifier
    ON medical_renal_transplant_recipient_request.patient(national_health_identifier);
