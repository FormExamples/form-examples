-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS seasonal_affective_disorder_assessment;

COMMENT ON SCHEMA seasonal_affective_disorder_assessment IS
    'Namespace for the Seasonal Affective Disorder Assessment form''s tables, functions and domains.';
