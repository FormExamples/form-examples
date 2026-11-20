-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS national_early_warning_score_2;

COMMENT ON SCHEMA national_early_warning_score_2 IS
    'Namespace for the National Early Warning Score 2 (NEWS2) form''s tables, functions and domains.';
