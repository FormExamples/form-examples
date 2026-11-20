-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS international_patient_summary;

COMMENT ON SCHEMA international_patient_summary IS
    'Namespace for the International Patient Summary form''s tables, functions and domains.';
