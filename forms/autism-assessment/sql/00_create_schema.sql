-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS autism_assessment;

COMMENT ON SCHEMA autism_assessment IS
    'Namespace for the Autism Assessment form''s tables, functions and domains.';
