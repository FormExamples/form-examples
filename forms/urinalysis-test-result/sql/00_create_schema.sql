-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS urinalysis_test_result;

COMMENT ON SCHEMA urinalysis_test_result IS
    'Namespace for the Urinalysis Test Result form''s tables, functions and domains.';
