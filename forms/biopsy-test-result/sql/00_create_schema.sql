-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS biopsy_test_result;

COMMENT ON SCHEMA biopsy_test_result IS
    'Namespace for the Biopsy Test Result form''s tables, functions and domains.';
