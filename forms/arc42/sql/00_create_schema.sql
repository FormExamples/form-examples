-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS arc42;

COMMENT ON SCHEMA arc42 IS
    'Namespace for the arc42 form''s tables, functions and domains.';
