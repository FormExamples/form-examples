-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS patient_satisfaction_survey;

COMMENT ON SCHEMA patient_satisfaction_survey IS
    'Namespace for the Patient Satisfaction Survey form''s tables, functions and domains.';
