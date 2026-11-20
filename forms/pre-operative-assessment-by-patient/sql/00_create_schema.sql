-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS pre_operative_assessment_by_patient;

COMMENT ON SCHEMA pre_operative_assessment_by_patient IS
    'Namespace for the Pre-operative Assessment by Patient form''s tables, functions and domains.';
