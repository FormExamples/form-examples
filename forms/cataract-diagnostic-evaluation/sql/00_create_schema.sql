-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS cataract_diagnostic_evaluation;

COMMENT ON SCHEMA cataract_diagnostic_evaluation IS
    'Namespace for the Cataract Diagnostic Evaluation form''s tables, functions and domains.';
