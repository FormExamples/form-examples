-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS emergency_medical_technician_psychomotor_examination;

COMMENT ON SCHEMA emergency_medical_technician_psychomotor_examination IS
    'Namespace for the Emergency Medical Technician Psychomotor Examination form''s tables, functions and domains.';
