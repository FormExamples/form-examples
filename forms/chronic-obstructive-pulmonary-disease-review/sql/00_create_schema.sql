-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS chronic_obstructive_pulmonary_disease_review;

COMMENT ON SCHEMA chronic_obstructive_pulmonary_disease_review IS
    'Namespace for the Chronic Obstructive Pulmonary Disease Review (COPD Annual Review) form''s tables, functions and domains.';
