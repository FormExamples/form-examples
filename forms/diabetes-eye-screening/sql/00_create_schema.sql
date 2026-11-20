-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS diabetes_eye_screening;

COMMENT ON SCHEMA diabetes_eye_screening IS
    'Namespace for the Diabetes Eye Screening record form''s tables, functions and domains.';
