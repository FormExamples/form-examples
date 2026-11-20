-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_device_assessment;

COMMENT ON SCHEMA medical_device_assessment IS
    'Namespace for the Medical Device Assessment form''s tables, functions and domains.';
