-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS agile_principles_assessment;

COMMENT ON SCHEMA agile_principles_assessment IS
    'Namespace for the Agile Principles Assessment form''s tables, functions and domains.';
