-- Worker (e.g. a clinician) who paid a work-related expense from their own money and claims repayment.

CREATE TABLE expense_reimbursement.worker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    name VARCHAR(255) NOT NULL,
    email TEXT,
    phone TEXT,
    postal_address_as_full_text TEXT,
    country_as_iso_3166_1_alpha_2 CHAR(2),
    postcode TEXT,
    employee_reference VARCHAR(64) UNIQUE,
    job_title VARCHAR(255) NOT NULL DEFAULT '',
    department VARCHAR(255) NOT NULL DEFAULT '',
    cost_centre VARCHAR(64) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_worker_updated_at
    BEFORE UPDATE ON expense_reimbursement.worker
    FOR EACH ROW
    EXECUTE FUNCTION expense_reimbursement.set_updated_at();

COMMENT ON TABLE expense_reimbursement.worker IS
    'Worker (e.g. a clinician) who paid a work-related expense personally and claims to be repaid.';

COMMENT ON COLUMN expense_reimbursement.worker.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement.worker.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement.worker.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement.worker.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement.worker.name IS
    'Name.';
COMMENT ON COLUMN expense_reimbursement.worker.email IS
    'Email.';
COMMENT ON COLUMN expense_reimbursement.worker.phone IS
    'Phone.';
COMMENT ON COLUMN expense_reimbursement.worker.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN expense_reimbursement.worker.country_as_iso_3166_1_alpha_2 IS
    'Country as iso 3166 1 alpha 2.';
COMMENT ON COLUMN expense_reimbursement.worker.postcode IS
    'Postcode.';
COMMENT ON COLUMN expense_reimbursement.worker.employee_reference IS
    'Employee reference.';
COMMENT ON COLUMN expense_reimbursement.worker.job_title IS
    'Job title.';
COMMENT ON COLUMN expense_reimbursement.worker.department IS
    'Department.';
COMMENT ON COLUMN expense_reimbursement.worker.cost_centre IS
    'Cost centre.';
