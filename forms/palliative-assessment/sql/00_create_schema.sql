-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS palliative_assessment;

COMMENT ON SCHEMA palliative_assessment IS
    'Namespace for the Palliative Assessment form''s tables, functions and domains.';
