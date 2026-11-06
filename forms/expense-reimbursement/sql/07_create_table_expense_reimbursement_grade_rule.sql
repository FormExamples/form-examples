-- Audit trail of every scoring rule that fired for an expense reimbursement claim.

CREATE TABLE expense_reimbursement_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    expense_reimbursement_grade_id UUID NOT NULL
        REFERENCES expense_reimbursement_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(40) NOT NULL,
    axis VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (axis IN ('compliance', 'completeness', 'approval', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_expense_reimbursement_grade_rule_grade_id
    ON expense_reimbursement_grade_rule(expense_reimbursement_grade_id);

CREATE TRIGGER trigger_expense_reimbursement_grade_rule_updated_at
    BEFORE UPDATE ON expense_reimbursement_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE expense_reimbursement_grade_rule IS
    'Audit trail of every compliance / completeness / approval rule that fired for this claim.';

COMMENT ON COLUMN expense_reimbursement_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.expense_reimbursement_grade_id IS
    'Foreign key to the expense_reimbursement_grade table.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.rule_id IS
    'Rule ID.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.axis IS
    'Axis. One of: compliance, completeness, approval.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.category IS
    'Category.';
COMMENT ON COLUMN expense_reimbursement_grade_rule.description IS
    'Description.';
