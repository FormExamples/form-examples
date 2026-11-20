-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS prescription_request;

COMMENT ON SCHEMA prescription_request IS
    'Namespace for the Prescription Request form''s tables, functions and domains.';
