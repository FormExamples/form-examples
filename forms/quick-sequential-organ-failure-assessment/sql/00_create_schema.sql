-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS quick_sequential_organ_failure_assessment;

COMMENT ON SCHEMA quick_sequential_organ_failure_assessment IS
    'Namespace for the Quick Sequential Organ Failure Assessment (qSOFA) form''s tables, functions and domains.';
