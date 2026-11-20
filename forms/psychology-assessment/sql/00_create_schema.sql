-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS psychology_assessment;

COMMENT ON SCHEMA psychology_assessment IS
    'Namespace for the Psychology Assessment form''s tables, functions and domains.';
