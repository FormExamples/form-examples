-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS framingham_risk_score_for_hard_coronary_heart_disease;

COMMENT ON SCHEMA framingham_risk_score_for_hard_coronary_heart_disease IS
    'Namespace for the Framingham Risk Score for Hard Coronary Heart Disease form''s tables, functions and domains.';
