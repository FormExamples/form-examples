-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS oncology_assessment;

COMMENT ON SCHEMA oncology_assessment IS
    'Namespace for the Oncology Assessment form''s tables, functions and domains.';
