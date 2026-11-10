-- Fraud-prevention and policy flags for an expense reimbursement claim, independent of the axes.

CREATE TABLE expense_reimbursement_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    expense_reimbursement_grade_id UUID NOT NULL
        REFERENCES expense_reimbursement_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN ('missing-receipt', 'duplicate-suspected', 'over-limit', 'stale-expense', 'no-prior-approval', 'no-declaration', 'foreign-currency', 'alcohol-or-personal', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_expense_reimbursement_grade_flag_grade_id
    ON expense_reimbursement_grade_flag(expense_reimbursement_grade_id);

CREATE TRIGGER trigger_expense_reimbursement_grade_flag_updated_at
    BEFORE UPDATE ON expense_reimbursement_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE expense_reimbursement_grade_flag IS
    'Fraud-prevention and policy flags raised for this claim, independent of the three axes.';

COMMENT ON COLUMN expense_reimbursement_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.expense_reimbursement_grade_id IS
    'Foreign key to the expense_reimbursement_grade table.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.flag_id IS
    'Flag ID.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.category IS
    'Category. One of: missing-receipt, duplicate-suspected, over-limit, stale-expense, no-prior-approval, no-declaration, foreign-currency, alcohol-or-personal, ….';
COMMENT ON COLUMN expense_reimbursement_grade_flag.priority IS
    'Priority. One of: low, medium, high.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.description IS
    'Description.';
COMMENT ON COLUMN expense_reimbursement_grade_flag.suggested_action IS
    'Suggested action.';
