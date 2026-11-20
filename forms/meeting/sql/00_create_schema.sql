-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS meeting;

COMMENT ON SCHEMA meeting IS
    'Namespace for the Meeting form''s tables, functions and domains.';
