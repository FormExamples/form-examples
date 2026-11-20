-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS paediatric_early_warning_score;

COMMENT ON SCHEMA paediatric_early_warning_score IS
    'Namespace for the Paediatric Early Warning Score (PEWS) form''s tables, functions and domains.';
