-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS heart_health_check;

COMMENT ON SCHEMA heart_health_check IS
    'Namespace for the Heart Health Check form''s tables, functions and domains.';
