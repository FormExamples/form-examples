-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS toxicology_test_result;

COMMENT ON SCHEMA toxicology_test_result IS
    'Namespace for the Toxicology Test Result form''s tables, functions and domains.';
