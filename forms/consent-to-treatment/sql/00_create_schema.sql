-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS consent_to_treatment;

COMMENT ON SCHEMA consent_to_treatment IS
    'Namespace for the Consent to Treatment form''s tables, functions and domains.';
