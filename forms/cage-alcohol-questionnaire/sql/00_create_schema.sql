-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS cage_alcohol_questionnaire;

COMMENT ON SCHEMA cage_alcohol_questionnaire IS
    'Namespace for the CAGE Alcohol Questionnaire form''s tables, functions and domains.';
