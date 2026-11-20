-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS structured_medication_review;

COMMENT ON SCHEMA structured_medication_review IS
    'Namespace for the Structured Medication Review (SMR) form''s tables, functions and domains.';
