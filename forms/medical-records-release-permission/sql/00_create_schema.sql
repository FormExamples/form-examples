-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_records_release_permission;

COMMENT ON SCHEMA medical_records_release_permission IS
    'Namespace for the Medical Records Release Permission form''s tables, functions and domains.';
