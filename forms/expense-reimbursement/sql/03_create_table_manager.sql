-- Approver (line manager or finance contact) who reviews and approves the expense claim.

CREATE TABLE expense_reimbursement.manager (
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
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('line-manager', 'budget-holder', 'finance', 'senior-manager', 'other', '')),
    job_title TEXT NOT NULL DEFAULT '',
    department TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_manager_updated_at
    BEFORE UPDATE ON expense_reimbursement.manager
    FOR EACH ROW
    EXECUTE FUNCTION expense_reimbursement.set_updated_at();

COMMENT ON TABLE expense_reimbursement.manager IS
    'Approver (line manager, budget holder or finance contact) who reviews the expense claim.';

COMMENT ON COLUMN expense_reimbursement.manager.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement.manager.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement.manager.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement.manager.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement.manager.name IS
    'Name.';
COMMENT ON COLUMN expense_reimbursement.manager.email IS
    'Email.';
COMMENT ON COLUMN expense_reimbursement.manager.phone IS
    'Phone.';
COMMENT ON COLUMN expense_reimbursement.manager.postal_address_as_full_text IS
    'Postal address as full text.';
COMMENT ON COLUMN expense_reimbursement.manager.country_as_iso_3166_1_alpha_2 IS
    'Country as iso 3166 1 alpha 2.';
COMMENT ON COLUMN expense_reimbursement.manager.postcode IS
    'Postcode.';
COMMENT ON COLUMN expense_reimbursement.manager.role IS
    'Role. One of: line-manager, budget-holder, finance, senior-manager, other.';
COMMENT ON COLUMN expense_reimbursement.manager.job_title IS
    'Job title.';
COMMENT ON COLUMN expense_reimbursement.manager.department IS
    'Department.';
