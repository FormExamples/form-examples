-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS hip_replacement_surgery_evaluation;

COMMENT ON SCHEMA hip_replacement_surgery_evaluation IS
    'Namespace for the Hip Replacement Surgery Evaluation form''s tables, functions and domains.';
