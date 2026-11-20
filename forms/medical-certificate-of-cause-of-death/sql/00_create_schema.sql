-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS medical_certificate_of_cause_of_death;

COMMENT ON SCHEMA medical_certificate_of_cause_of_death IS
    'Namespace for the Medical Certificate of Cause of Death (MCCD) form''s tables, functions and domains.';
