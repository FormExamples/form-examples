-- Employee (the patient) who is taking sick leave.

CREATE TABLE medical_fit_note.employee (
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
    united_kingdom_nhs_number VARCHAR(20) UNIQUE,
    employer_name TEXT NOT NULL DEFAULT '',
    job_title TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_employee_updated_at
    BEFORE UPDATE ON medical_fit_note.employee
    FOR EACH ROW
    EXECUTE FUNCTION medical_fit_note.set_updated_at();

CREATE INDEX employee_index_gto
    ON medical_fit_note.employee
    USING GIN ((
        name
    ) gin_trgm_ops);

COMMENT ON TABLE medical_fit_note.employee IS
    'Employee.';
COMMENT ON COLUMN medical_fit_note.employee.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_fit_note.employee.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_fit_note.employee.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_fit_note.employee.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_fit_note.employee.name IS
    'Name.';
COMMENT ON COLUMN medical_fit_note.employee.birth_date IS
    'Birth date.';
COMMENT ON COLUMN medical_fit_note.employee.email IS
    'Email.';
COMMENT ON COLUMN medical_fit_note.employee.phone IS
    'Phone.';
COMMENT ON COLUMN medical_fit_note.employee.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN medical_fit_note.employee.country_as_iso_3166_1_alpha_2 IS
    'Country as iso 3166 1 alpha 2.';
COMMENT ON COLUMN medical_fit_note.employee.postcode IS
    'Postcode.';
COMMENT ON COLUMN medical_fit_note.employee.united_kingdom_nhs_number IS
    'United kingdom NHS number.';
COMMENT ON COLUMN medical_fit_note.employee.employer_name IS
    'Employer name.';
COMMENT ON COLUMN medical_fit_note.employee.job_title IS
    'Job title.';
