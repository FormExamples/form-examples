-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS blood_cross_match_test_result;

COMMENT ON SCHEMA blood_cross_match_test_result IS
    'Namespace for the Blood Cross-Match Test Result form''s tables, functions and domains.';
