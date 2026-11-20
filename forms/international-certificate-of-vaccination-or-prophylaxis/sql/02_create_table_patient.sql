-- Vaccinee (the person to whom the certificate is issued).
-- "Patient" is used as the canonical table name to match the monorepo
-- convention; in WHO terminology the same person is referred to as the
-- "vaccinee" on the International Certificate of Vaccination or Prophylaxis.

CREATE TABLE international_certificate_of_vaccination_or_prophylaxis.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    surname VARCHAR(255) NOT NULL DEFAULT '',
    given_names VARCHAR(255) NOT NULL DEFAULT '',
    birth_date DATE,
    sex VARCHAR(15) NOT NULL DEFAULT '' CHECK (sex IN ('male', 'female', 'other', 'unspecified', '')),
    nationality_as_iso_3166_1_alpha_3 CHAR(3) NOT NULL DEFAULT '',
    travel_document_kind VARCHAR(30) NOT NULL DEFAULT '' CHECK (travel_document_kind IN ('passport', 'national-id', 'travel-document', 'other', '')),
    travel_document_number VARCHAR(50) NOT NULL DEFAULT '',
    travel_document_issuer_as_iso_3166_1_alpha_3 CHAR(3) NOT NULL DEFAULT '',
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    consented_to_data_sharing VARCHAR(5) NOT NULL DEFAULT '' CHECK (consented_to_data_sharing IN ('yes', 'no', '')),
    signature_image_data_url TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON international_certificate_of_vaccination_or_prophylaxis.patient
    FOR EACH ROW
    EXECUTE FUNCTION international_certificate_of_vaccination_or_prophylaxis.set_updated_at();

COMMENT ON TABLE international_certificate_of_vaccination_or_prophylaxis.patient IS
    'Vaccinee identified on an International Certificate of Vaccination or Prophylaxis. The vaccinee may be a traveller of any age.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.surname IS
    'Surname (family name) exactly as it appears on the travel document.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.given_names IS
    'Given names (one or more) exactly as they appear on the travel document.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.birth_date IS
    'Date of birth, in the format day in figures, month in letters, year in figures.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.sex IS
    'Sex as recorded on the travel document: male, female, other, unspecified.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.nationality_as_iso_3166_1_alpha_3 IS
    'Nationality as ISO 3166-1 alpha-3 three-letter country code (WHO model uses three-letter form).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.travel_document_kind IS
    'Kind of travel document presented: passport, national-id, travel-document, other.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.travel_document_number IS
    'Number of the travel document presented at the vaccination encounter.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.travel_document_issuer_as_iso_3166_1_alpha_3 IS
    'Country that issued the travel document, ISO 3166-1 alpha-3.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.email IS
    'Email address.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.postal_address_as_full_text IS
    'Postal address as full free-text.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.country_as_iso_3166_1_alpha_2 IS
    'Country of residence for postal validation, ISO 3166-1 alpha-2.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.postcode IS
    'Postal code for the postal address.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.consented_to_data_sharing IS
    'Whether the vaccinee has consented to onward sharing of the certificate data.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient.signature_image_data_url IS
    'Vaccinee signature captured as a data URL (PNG) if signed digitally; empty if signed on paper.';

CREATE INDEX patient_index_surname_given_names_gto
    ON international_certificate_of_vaccination_or_prophylaxis.patient
    USING GIN ((
        surname || ' ' || given_names
    ) gin_trgm_ops);
