-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS employee_onboarding_checklist;

COMMENT ON SCHEMA employee_onboarding_checklist IS
    'Namespace for the Employee Onboarding Checklist form''s tables, functions and domains.';
