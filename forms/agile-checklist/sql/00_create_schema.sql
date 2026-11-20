-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS agile_checklist;

COMMENT ON SCHEMA agile_checklist IS
    'Namespace for the Agile Checklist form''s tables, functions and domains.';
