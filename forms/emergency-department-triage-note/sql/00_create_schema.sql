-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS emergency_department_triage_note;

COMMENT ON SCHEMA emergency_department_triage_note IS
    'Namespace for the Emergency Department Triage Note form''s tables, functions and domains.';
