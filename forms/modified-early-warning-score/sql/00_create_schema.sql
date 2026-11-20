-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS modified_early_warning_score;

COMMENT ON SCHEMA modified_early_warning_score IS
    'Namespace for the Modified Early Warning Score (MEWS) form''s tables, functions and domains.';
