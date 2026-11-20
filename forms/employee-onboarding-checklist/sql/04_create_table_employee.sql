CREATE TABLE employee_onboarding_checklist.employee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    nhs_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(30) NOT NULL DEFAULT '',
    job_title VARCHAR(255) NOT NULL DEFAULT '',
    department VARCHAR(255) NOT NULL DEFAULT '',
    start_date DATE
);

CREATE TRIGGER trigger_employee_updated_at
    BEFORE UPDATE ON employee_onboarding_checklist.employee
    FOR EACH ROW
    EXECUTE FUNCTION employee_onboarding_checklist.set_updated_at();

COMMENT ON TABLE employee_onboarding_checklist.employee IS
    'Employee demographic information for healthcare staff onboarding.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.first_name IS
    'Employee given name.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.last_name IS
    'Employee family name.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.date_of_birth IS
    'Employee date of birth.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.nhs_number IS
    'NHS number, unique per employee.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.email IS
    'Employee email address.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.phone IS
    'Employee phone number.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.job_title IS
    'Job title for the role being onboarded.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.department IS
    'Department or ward the employee will join.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.start_date IS
    'Agreed start date for the role.';

COMMENT ON COLUMN employee_onboarding_checklist.employee.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN employee_onboarding_checklist.employee.deleted_at IS
    'Timestamp when this row was deleted.';
