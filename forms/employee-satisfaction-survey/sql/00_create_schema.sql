-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS employee_satisfaction_survey;

COMMENT ON SCHEMA employee_satisfaction_survey IS
    'Namespace for the Employee Satisfaction Survey form''s tables, functions and domains.';
