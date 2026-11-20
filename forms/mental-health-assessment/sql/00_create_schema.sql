-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS mental_health_assessment;

COMMENT ON SCHEMA mental_health_assessment IS
    'Namespace for the Mental Health Assessment form''s tables, functions and domains.';
