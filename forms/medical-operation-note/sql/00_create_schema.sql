-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_operation_note;

COMMENT ON SCHEMA medical_operation_note IS
    'Namespace for the Medical Operation Note form''s tables, functions and domains.';
