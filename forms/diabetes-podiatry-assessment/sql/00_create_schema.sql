-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS diabetes_podiatry_assessment;

COMMENT ON SCHEMA diabetes_podiatry_assessment IS
    'Namespace for the Diabetes Podiatry Assessment form''s tables, functions and domains.';
