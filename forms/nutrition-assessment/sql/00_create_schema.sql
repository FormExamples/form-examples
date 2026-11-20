-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS nutrition_assessment;

COMMENT ON SCHEMA nutrition_assessment IS
    'Namespace for the Nutrition Assessment form''s tables, functions and domains.';
