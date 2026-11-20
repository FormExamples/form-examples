-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS semaglutide_assessment;

COMMENT ON SCHEMA semaglutide_assessment IS
    'Namespace for the Semaglutide Assessment form''s tables, functions and domains.';
