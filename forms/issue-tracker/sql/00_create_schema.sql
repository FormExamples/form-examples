-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS issue_tracker;

COMMENT ON SCHEMA issue_tracker IS
    'Namespace for the Issue tracker form''s tables, functions and domains.';
