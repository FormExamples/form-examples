-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS advance_statement_about_care;

COMMENT ON SCHEMA advance_statement_about_care IS
    'Namespace for the Advance Statement About Care form''s tables, functions and domains.';
