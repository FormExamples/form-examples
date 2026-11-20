-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS code_of_conduct_notice;

COMMENT ON SCHEMA code_of_conduct_notice IS
    'Namespace for the Code of Conduct Notice form''s tables, functions and domains.';
