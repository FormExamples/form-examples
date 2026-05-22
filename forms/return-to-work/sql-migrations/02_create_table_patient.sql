-- Patient demographic information for the Return to Work form.

CREATE TABLE patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', 'prefer-not-to-say', '')),
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    job_title VARCHAR(255) NOT NULL DEFAULT '',
    role_description TEXT NOT NULL DEFAULT '',
    contracted_hours_per_week NUMERIC(4,1),
    shift_pattern VARCHAR(50) NOT NULL DEFAULT '' CHECK (shift_pattern IN ('day', 'night', 'rotating', 'on-call', 'irregular', 'fixed', '')),
    safety_critical_role VARCHAR(5) NOT NULL DEFAULT '' CHECK (safety_critical_role IN ('yes', 'no', '')),
    dvla_group_1_licence_held VARCHAR(5) NOT NULL DEFAULT '' CHECK (dvla_group_1_licence_held IN ('yes', 'no', '')),
    dvla_group_2_licence_held VARCHAR(5) NOT NULL DEFAULT '' CHECK (dvla_group_2_licence_held IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_patient_updated_at
    BEFORE UPDATE ON patient
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient IS
    'Patient (the employee) whose return to work is being assessed.';
COMMENT ON COLUMN patient.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN patient.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient.name IS
    'Full legal name as it appears on identification.';
COMMENT ON COLUMN patient.birth_date IS
    'Date of birth.';
COMMENT ON COLUMN patient.sex IS
    'Sex recorded at birth for clinical purposes.';
COMMENT ON COLUMN patient.email IS
    'Email address.';
COMMENT ON COLUMN patient.phone IS
    'Phone number.';
COMMENT ON COLUMN patient.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN patient.country_as_iso_3166_1_alpha_2 IS
    'Country as ISO 3166-1 alpha-2 format.';
COMMENT ON COLUMN patient.postcode IS
    'Postal code.';
COMMENT ON COLUMN patient.united_kingdom_nhs_number IS
    'United Kingdom NHS number, unique per person.';
COMMENT ON COLUMN patient.job_title IS
    'Patient job title (e.g. Software Engineer, Healthcare Assistant).';
COMMENT ON COLUMN patient.role_description IS
    'Free-text description of the patient day-to-day duties.';
COMMENT ON COLUMN patient.contracted_hours_per_week IS
    'Contracted hours per week (full-time UK baseline 37.5).';
COMMENT ON COLUMN patient.shift_pattern IS
    'Shift pattern: day, night, rotating, on-call, irregular, or fixed.';
COMMENT ON COLUMN patient.safety_critical_role IS
    'Whether the role is safety-critical (aviation, rail, healthcare, emergency response, etc.).';
COMMENT ON COLUMN patient.dvla_group_1_licence_held IS
    'Whether the patient holds a DVLA Group 1 (car / motorcycle) licence.';
COMMENT ON COLUMN patient.dvla_group_2_licence_held IS
    'Whether the patient holds a DVLA Group 2 (HGV / PCV) licence.';

CREATE INDEX patient_index_gto
    ON patient
    USING GIN ((
        name
    ) gin_trgm_ops);
