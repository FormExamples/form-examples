-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medication_reconciliation;

COMMENT ON SCHEMA medication_reconciliation IS
    'Namespace for the Medication Reconciliation form''s tables, functions and domains.';
