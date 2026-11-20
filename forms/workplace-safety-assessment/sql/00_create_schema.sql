-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS workplace_safety_assessment;

COMMENT ON SCHEMA workplace_safety_assessment IS
    'Namespace for the Workplace Safety Assessment form''s tables, functions and domains.';
