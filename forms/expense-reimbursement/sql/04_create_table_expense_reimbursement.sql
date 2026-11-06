-- Expense reimbursement claim: the worker requests repayment for work-related expenses paid personally.

CREATE TABLE expense_reimbursement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    worker_id UUID NOT NULL REFERENCES worker(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES manager(id) ON DELETE CASCADE,

    -- Claim lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'under-review', 'approved', 'partially-approved', 'rejected', 'paid', 'withdrawn', '')),
    claim_date DATE,
    claim_period_start_date DATE,
    claim_period_end_date DATE,
    claim_title VARCHAR(255) NOT NULL DEFAULT '',
    business_purpose TEXT NOT NULL DEFAULT '',
    project_or_cost_code VARCHAR(64) NOT NULL DEFAULT '',

    -- Money
    currency_as_iso_4217 CHAR(3) NOT NULL DEFAULT 'GBP',
    total_amount NUMERIC(12, 2),
    total_vat_amount NUMERIC(12, 2),
    advance_already_received_amount NUMERIC(12, 2),
    amount_to_repay NUMERIC(12, 2),

    -- Payment back to the worker
    repayment_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (repayment_method IN ('payroll', 'bank-transfer', 'cheque', 'cash', 'other', '')),
    bank_account_name VARCHAR(255) NOT NULL DEFAULT '',
    bank_account_last_four CHAR(4),

    -- Declarations
    declaration_expenses_were_incurred_wholly_for_work BOOLEAN NOT NULL DEFAULT FALSE,
    declaration_no_duplicate_claim BOOLEAN NOT NULL DEFAULT FALSE,
    declaration_receipts_attached BOOLEAN NOT NULL DEFAULT FALSE,
    declaration_signed_name VARCHAR(255) NOT NULL DEFAULT '',
    declaration_signed_at TIMESTAMPTZ
);

CREATE INDEX index_expense_reimbursement_worker_id ON expense_reimbursement(worker_id);
CREATE INDEX index_expense_reimbursement_manager_id ON expense_reimbursement(manager_id);

CREATE TRIGGER trigger_expense_reimbursement_updated_at
    BEFORE UPDATE ON expense_reimbursement
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE expense_reimbursement IS
    'Expense reimbursement claim: a worker asks the employer to repay money the worker spent personally on work-related expenses.';

COMMENT ON COLUMN expense_reimbursement.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement.worker_id IS
    'Foreign key to the worker table.';
COMMENT ON COLUMN expense_reimbursement.manager_id IS
    'Foreign key to the manager table.';
COMMENT ON COLUMN expense_reimbursement.status IS
    'Lifecycle status of this row.';
COMMENT ON COLUMN expense_reimbursement.claim_date IS
    'Claim date.';
COMMENT ON COLUMN expense_reimbursement.claim_period_start_date IS
    'Claim period start date.';
COMMENT ON COLUMN expense_reimbursement.claim_period_end_date IS
    'Claim period end date.';
COMMENT ON COLUMN expense_reimbursement.claim_title IS
    'Claim title.';
COMMENT ON COLUMN expense_reimbursement.business_purpose IS
    'Business purpose.';
COMMENT ON COLUMN expense_reimbursement.project_or_cost_code IS
    'Project or cost code.';
COMMENT ON COLUMN expense_reimbursement.currency_as_iso_4217 IS
    'Currency as iso 4217.';
COMMENT ON COLUMN expense_reimbursement.total_amount IS
    'Total amount.';
COMMENT ON COLUMN expense_reimbursement.total_vat_amount IS
    'Total vat amount.';
COMMENT ON COLUMN expense_reimbursement.advance_already_received_amount IS
    'Advance already received amount.';
COMMENT ON COLUMN expense_reimbursement.amount_to_repay IS
    'Amount to repay.';
COMMENT ON COLUMN expense_reimbursement.repayment_method IS
    'Repayment method. One of: payroll, bank-transfer, cheque, cash, other.';
COMMENT ON COLUMN expense_reimbursement.bank_account_name IS
    'Bank account name.';
COMMENT ON COLUMN expense_reimbursement.bank_account_last_four IS
    'Bank account last four.';
COMMENT ON COLUMN expense_reimbursement.declaration_expenses_were_incurred_wholly_for_work IS
    'Declaration expenses were incurred wholly for work.';
COMMENT ON COLUMN expense_reimbursement.declaration_no_duplicate_claim IS
    'Declaration no duplicate claim.';
COMMENT ON COLUMN expense_reimbursement.declaration_receipts_attached IS
    'Declaration receipts attached.';
COMMENT ON COLUMN expense_reimbursement.declaration_signed_name IS
    'Declaration signed name.';
COMMENT ON COLUMN expense_reimbursement.declaration_signed_at IS
    'Declaration signed at.';
