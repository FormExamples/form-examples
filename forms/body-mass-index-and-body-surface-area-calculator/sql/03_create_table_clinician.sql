-- Clinician information used to identify the staff member who recorded a
-- body-mass-index and body-surface-area calculation.

CREATE TABLE body_mass_index_and_body_surface_area_calculator.clinician (
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
    role VARCHAR(20) NOT NULL DEFAULT '' CHECK (role IN ('doctor', 'nurse', 'pharmacist', 'dietitian', 'other', '')),
    registration_body VARCHAR(20) NOT NULL DEFAULT '' CHECK (registration_body IN ('GMC', 'NMC', 'HCPC', 'GPhC', 'other', '')),
    registration_number TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_clinician_updated_at
    BEFORE UPDATE ON body_mass_index_and_body_surface_area_calculator.clinician
    FOR EACH ROW
    EXECUTE FUNCTION body_mass_index_and_body_surface_area_calculator.set_updated_at();

COMMENT ON TABLE body_mass_index_and_body_surface_area_calculator.clinician IS
    'Clinician identifying information for the staff member recording a body-mass-index and body-surface-area calculation.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.name IS
    'Clinician full name as recorded in the rota.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.email IS
    'Email address.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.phone IS
    'Phone number.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.postal_address_as_full_text IS
    'Postal address as a single text block.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.postcode IS
    'Postal code.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.role IS
    'Primary clinical role: doctor, nurse, pharmacist, dietitian, or other.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.registration_body IS
    'Professional registration body: GMC, NMC, HCPC, GPhC, or other.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician.registration_number IS
    'Professional registration number issued by the registration body.';

CREATE INDEX clinician_name_trgm_idx
    ON body_mass_index_and_body_surface_area_calculator.clinician
    USING GIN (name gin_trgm_ops);
