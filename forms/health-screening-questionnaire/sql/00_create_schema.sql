-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS health_screening_questionnaire;

COMMENT ON SCHEMA health_screening_questionnaire IS
    'Namespace for the Health Screening Questionnaire form''s tables, functions and domains.';
