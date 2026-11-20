-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS microbiology_culture_test_result;

COMMENT ON SCHEMA microbiology_culture_test_result IS
    'Namespace for the Microbiology Culture Test Result form''s tables, functions and domains.';
