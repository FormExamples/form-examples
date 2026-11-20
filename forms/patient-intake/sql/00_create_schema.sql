-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS patient_intake;

COMMENT ON SCHEMA patient_intake IS
    'Namespace for the Patient Intake form''s tables, functions and domains.';
