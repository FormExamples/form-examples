-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS objectives_and_key_results_tracker;

COMMENT ON SCHEMA objectives_and_key_results_tracker IS
    'Namespace for the Objectives and Key Results tracker form''s tables, functions and domains.';
