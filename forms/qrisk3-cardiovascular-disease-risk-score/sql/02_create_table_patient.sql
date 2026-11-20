-- Patient demographic information.

CREATE TABLE qrisk3_cardiovascular_disease_risk_score.patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    hospital_mrn VARCHAR(50),
    height_as_cm NUMERIC(5,1),
    weight_as_kg NUMERIC(5,1),
    body_mass_index NUMERIC(4,1),
    allergies_summary TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON qrisk3_cardiovascular_disease_risk_score.patient
    FOR EACH ROW
    EXECUTE FUNCTION qrisk3_cardiovascular_disease_risk_score.set_updated_at();

COMMENT ON TABLE qrisk3_cardiovascular_disease_risk_score.patient IS
    'Patient demographic information used by the QRISK3 assessment record.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.name IS
    'Full patient name.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.sex IS
    'Sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.email IS
    'Email address.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.phone IS
    'Phone number.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.postcode IS
    'Postal code.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.hospital_mrn IS
    'Local hospital medical record number (MRN).';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.height_as_cm IS
    'Height in centimetres.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.weight_as_kg IS
    'Weight in kilograms.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.body_mass_index IS
    'Body mass index (BMI), kg/m^2.';
COMMENT ON COLUMN qrisk3_cardiovascular_disease_risk_score.patient.allergies_summary IS
    'Free-text summary of known allergies.';

CREATE INDEX patient_name_trgm_idx
    ON qrisk3_cardiovascular_disease_risk_score.patient
    USING GIN (name gin_trgm_ops);
