-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS holter_monitor_test_result;

COMMENT ON SCHEMA holter_monitor_test_result IS
    'Namespace for the Holter Monitor Test Result form''s tables, functions and domains.';
