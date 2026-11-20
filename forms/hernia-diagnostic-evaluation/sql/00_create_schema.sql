-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS hernia_diagnostic_evaluation;

COMMENT ON SCHEMA hernia_diagnostic_evaluation IS
    'Namespace for the Hernia Diagnostic Evaluation form''s tables, functions and domains.';
