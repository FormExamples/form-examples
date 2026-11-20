-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS employee_offboarding_checklist;

COMMENT ON SCHEMA employee_offboarding_checklist IS
    'Namespace for the Employee Offboarding Checklist form''s tables, functions and domains.';
