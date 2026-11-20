-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS pre_operative_assessment_by_clinician;

COMMENT ON SCHEMA pre_operative_assessment_by_clinician IS
    'Namespace for the Pre-operative Assessment by Clinician form''s tables, functions and domains.';
