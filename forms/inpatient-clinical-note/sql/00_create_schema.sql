-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS inpatient_clinical_note;

COMMENT ON SCHEMA inpatient_clinical_note IS
    'Namespace for the Inpatient Clinical Note form''s tables, functions and domains.';
