-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS systematic_coronary_risk_evaluation_2_diabetes;

COMMENT ON SCHEMA systematic_coronary_risk_evaluation_2_diabetes IS
    'Namespace for the SCORE2-Diabetes form''s tables, functions and domains.';
