-- Applicant (person making the application to the DVLA) for a vehicle
-- registration application: name, date of birth, address, and the identity
-- documents supplied to prove who they are.

CREATE TABLE united_kingdom_vehicle_registration_application.applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    driving_licence_number VARCHAR(20) NOT NULL DEFAULT '',
    identity_document_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (identity_document_type IN ('photocard-driving-licence', 'passport', 'other-name-document', 'none', '')),
    address_document_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (address_document_type IN ('photocard-driving-licence', 'utility-bill', 'bank-statement', 'council-tax-bill', 'none', ''))
);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_registration_application.applicant
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_vehicle_registration_application.set_updated_at();

COMMENT ON TABLE united_kingdom_vehicle_registration_application.applicant IS
    'Applicant (person making the application to the DVLA) for a vehicle registration application: name, date of birth, address, and identity documents supplied.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.name IS
    'Full name of the applicant as it appears on their identity document.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.birth_date IS
    'Date of birth of the applicant.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.email IS
    'Email address.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.phone IS
    'Phone number.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.postcode IS
    'Postal code.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.driving_licence_number IS
    'Great Britain driving licence number (16 characters) when the applicant holds a photocard licence, else empty.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.identity_document_type IS
    'Identity document supplied: photocard-driving-licence, passport, other-name-document, or none.';
COMMENT ON COLUMN united_kingdom_vehicle_registration_application.applicant.address_document_type IS
    'Proof-of-address document supplied: photocard-driving-licence, utility-bill, bank-statement, council-tax-bill, or none.';

CREATE INDEX applicant_name_trgm_idx
    ON united_kingdom_vehicle_registration_application.applicant
    USING GIN (name gin_trgm_ops);
