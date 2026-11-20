-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS diabetes_assessment;

COMMENT ON SCHEMA diabetes_assessment IS
    'Namespace for the Diabetes Assessment form''s tables, functions and domains.';
