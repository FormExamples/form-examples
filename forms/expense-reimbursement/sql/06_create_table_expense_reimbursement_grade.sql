-- Computed grade for an expense reimbursement claim (three-axis engine).

CREATE TABLE expense_reimbursement_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    expense_reimbursement_id UUID NOT NULL UNIQUE
        REFERENCES expense_reimbursement(id) ON DELETE CASCADE,

    -- Axis A: policy compliance
    compliance_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (compliance_band IN ('compliant', 'needs-review', 'likely-ineligible', '')),

    -- Axis B: completeness
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR completeness_percent BETWEEN 0 AND 100),

    -- Axis C: approval tier
    approval_tier VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (approval_tier IN ('line-manager', 'budget-holder', 'finance-review', '')),

    recommendation VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('approve', 'request-more-information', 'escalate', 'reject', '')),
    manager_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_expense_reimbursement_grade_updated_at
    BEFORE UPDATE ON expense_reimbursement_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE expense_reimbursement_grade IS
    'Computed three-axis grade for an expense reimbursement claim: policy compliance, completeness and approval tier.';

COMMENT ON COLUMN expense_reimbursement_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN expense_reimbursement_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN expense_reimbursement_grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN expense_reimbursement_grade.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN expense_reimbursement_grade.expense_reimbursement_id IS
    'Foreign key to the expense_reimbursement table.';
COMMENT ON COLUMN expense_reimbursement_grade.compliance_band IS
    'Compliance band. One of: compliant, needs-review, likely-ineligible.';
COMMENT ON COLUMN expense_reimbursement_grade.completeness_percent IS
    'Completeness percent.';
COMMENT ON COLUMN expense_reimbursement_grade.approval_tier IS
    'Approval tier. One of: line-manager, budget-holder, finance-review.';
COMMENT ON COLUMN expense_reimbursement_grade.recommendation IS
    'Recommendation. One of: approve, request-more-information, escalate, reject.';
COMMENT ON COLUMN expense_reimbursement_grade.manager_notes IS
    'Manager notes.';
COMMENT ON COLUMN expense_reimbursement_grade.signed_at IS
    'Signed at.';
COMMENT ON COLUMN expense_reimbursement_grade.graded_at IS
    'Graded at.';
