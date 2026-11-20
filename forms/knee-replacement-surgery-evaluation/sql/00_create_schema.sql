-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS knee_replacement_surgery_evaluation;

COMMENT ON SCHEMA knee_replacement_surgery_evaluation IS
    'Namespace for the Knee Replacement Surgery Evaluation form''s tables, functions and domains.';
