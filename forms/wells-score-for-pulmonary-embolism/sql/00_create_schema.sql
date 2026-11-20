-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS wells_score_for_pulmonary_embolism;

COMMENT ON SCHEMA wells_score_for_pulmonary_embolism IS
    'Namespace for the Wells Score for Pulmonary Embolism form''s tables, functions and domains.';
