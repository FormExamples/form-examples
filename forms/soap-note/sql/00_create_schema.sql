-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS soap_note;

COMMENT ON SCHEMA soap_note IS
    'Namespace for the SOAP Note form''s tables, functions and domains.';
