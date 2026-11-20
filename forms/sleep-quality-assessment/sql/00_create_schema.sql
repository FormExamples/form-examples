-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS sleep_quality_assessment;

COMMENT ON SCHEMA sleep_quality_assessment IS
    'Namespace for the Sleep Quality Assessment form''s tables, functions and domains.';
