-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS blood_test_result;

COMMENT ON SCHEMA blood_test_result IS
    'Namespace for the Blood Test Result form''s tables, functions and domains.';
