-- The owner of the vehicle named on the application: an individual or a
-- business that will appear on the certificate of title.

CREATE TABLE united_states_vehicle_title_and_registration_application.applicant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name TEXT NOT NULL,
    owner_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (owner_type IN ('individual', 'business', '')),
    birth_date DATE,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    state_code VARCHAR(2) NOT NULL DEFAULT '',
    postcode TEXT,
    identification_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (identification_type IN ('drivers-license', 'state-id', 'passport', 'fein', 'other', '')),
    identification_number TEXT NOT NULL DEFAULT ''
);

CREATE INDEX applicant_name_trgm_idx
    ON united_states_vehicle_title_and_registration_application.applicant
    USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_applicant_updated_at
    BEFORE UPDATE ON united_states_vehicle_title_and_registration_application.applicant
    FOR EACH ROW
    EXECUTE FUNCTION united_states_vehicle_title_and_registration_application.set_updated_at();

COMMENT ON TABLE united_states_vehicle_title_and_registration_application.applicant IS
    'The owner of the vehicle named on a vehicle title and registration application: an individual or a business.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.name IS
    'Full legal name of the owner (an individual or a business).';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.owner_type IS
    'Owner type: individual or business.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.birth_date IS
    'Date of birth of an individual owner; empty for a business.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.email IS
    'Email address.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.phone IS
    'Phone number.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.postal_address_as_full_text IS
    'Mailing address as a single text block.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.state_code IS
    'Two-letter code of the state of residence.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.postcode IS
    'ZIP code.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.identification_type IS
    'Identification presented: driver license, state ID, passport, federal employer identification number, or other.';
COMMENT ON COLUMN united_states_vehicle_title_and_registration_application.applicant.identification_number IS
    'Identification number as shown on the document presented.';
