-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS eye_prescription;

COMMENT ON SCHEMA eye_prescription IS
    'Namespace for the Eye Prescription form''s tables, functions and domains.';
