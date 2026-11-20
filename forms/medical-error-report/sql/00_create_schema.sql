-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_error_report;

COMMENT ON SCHEMA medical_error_report IS
    'Namespace for the Medical Error Report form''s tables, functions and domains.';
