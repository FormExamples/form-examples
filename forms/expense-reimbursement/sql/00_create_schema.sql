-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS expense_reimbursement;

COMMENT ON SCHEMA expense_reimbursement IS
    'Namespace for the Expense Reimbursement form''s tables, functions and domains.';
